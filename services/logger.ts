import { InternalDB } from './internalDb.ts';

export interface LogEntry {
  timestamp: string;
  username: string;
  role: string;
  event: string;
  status: 'SUCCESS' | 'FAILURE';
  details: string;
}

export const Logger = {
  /**
   * Records a system event into the internal database.
   */
  logEvent: async (username: string, role: string, event: string, status: 'SUCCESS' | 'FAILURE' = 'SUCCESS') => {
    // 1. Log to Internal DB
    InternalDB.addLog(username, event, status);
    
    console.log(`[Internal DB Log] ${new Date().toISOString()} - ${username} (${role}): ${event} [${status}]`);
  },

  /**
   * Bridge to fetch logs from internal DB.
   */
  getLogs: (): any[] => {
    return InternalDB.getLogs().map(log => ({
      timestamp: log.timestamp,
      username: log.username,
      event: log.event,
      status: log.status,
      details: 'Internal Database Entry'
    }));
  },

  clearLogs: () => {
    localStorage.removeItem('supermart_db_logs');
  }
};