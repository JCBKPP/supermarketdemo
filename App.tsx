import React, { useState, useEffect } from 'react';
import Login from './pages/Login.tsx';
import Layout from './components/Layout.tsx';
import DashboardHome from './pages/DashboardHome.tsx';
import InventoryModule from './pages/InventoryModule.tsx';
import MarketingModule from './pages/MarketingModule.tsx';
import StaffHome from './pages/StaffHome.tsx';
import { UserRole, User } from './types.ts';
import { ADMIN_USER, STAFF_USER } from './constants.tsx';
import { Logger } from './services/logger.ts';
import { supabase, authService } from './services/supabase.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);

  // Supabase Auth Listener
  useEffect(() => {
    if (!supabase) {
      setIsInitializing(false);
      return;
    }

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        mapSupabaseUserToApp(session.user);
      }
      setIsInitializing(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        mapSupabaseUserToApp(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUserToApp = (sbUser: any) => {
    const metadata = sbUser.user_metadata;
    const appUser: User = {
      id: sbUser.id,
      username: metadata.preferred_username || sbUser.email?.split('@')[0] || 'user',
      fullName: metadata.full_name || metadata.name || 'External User',
      role: UserRole.ADMIN, // Default to admin for first external users or map based on logic
      avatar: metadata.avatar_url || `https://picsum.photos/seed/${sbUser.id}/200`,
      department: 'External Partner'
    };
    setUser(appUser);
    setActiveTab('dashboard');
    Logger.logEvent(appUser.username, appUser.role, 'Authenticated via Supabase/GitHub');
  };

  const handleLogin = (username: string, role: string) => {
    if (role === 'ADMIN') {
      setUser(ADMIN_USER);
      setActiveTab('dashboard');
      Logger.logEvent(username, role, 'User logged in to Admin Dashboard');
    } else {
      setUser(STAFF_USER);
      setActiveTab('home');
      Logger.logEvent(username, role, 'User logged in to Staff Portal');
    }
  };

  const handleLogout = async () => {
    if (user) {
      Logger.logEvent(user.username, user.role, 'User logged out');
    }
    await authService.signOut();
    setUser(null);
  };

  if (isInitializing) {
    return null; // CSS in index.html handles pulse animation for empty root
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {user.role === UserRole.ADMIN ? (
        <>
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'inventory' && <InventoryModule />}
          {activeTab === 'marketing' && <MarketingModule />}
          {activeTab === 'hr' && (
            <div className="p-12 text-center text-slate-400">
              <h2 className="text-xl font-bold italic tracking-tight">Human Resources</h2>
              <p className="text-sm mt-2">Personnel management systems initializing...</p>
            </div>
          )}
          {activeTab === 'analytics' && (
             <div className="p-12 text-center text-slate-400">
                <h2 className="text-xl font-bold italic tracking-tight">Analytics Lab</h2>
                <p className="text-sm mt-2">Aggregating real-time store metrics...</p>
             </div>
          )}
        </>
      ) : (
        <>
          {activeTab === 'home' && <StaffHome />}
          {activeTab === 'schedule' && (
             <div className="p-12 text-center text-slate-400">
                <h2 className="text-xl font-bold italic tracking-tight">Shift Calendar</h2>
                <p className="text-sm mt-2">Syncing with store schedule...</p>
             </div>
          )}
          {activeTab === 'leave' && (
             <div className="p-12 text-center text-slate-400">
                <h2 className="text-xl font-bold italic tracking-tight">Leave Management</h2>
                <p className="text-sm mt-2">Submit and track your time off here.</p>
             </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default App;