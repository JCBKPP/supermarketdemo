import { GOOGLE_SHEET_WEBHOOK_URL } from '../constants.tsx';

export interface LogEntry {
  timestamp: string;
  username: string;
  role: string;
  event: string;
  status: 'SUCCESS' | 'FAILURE';
  details: string;
}

const STORAGE_KEY = 'supermart_system_logs';

export const Logger = {
  /**
   * Records a system event locally and attempts to sync with Google Sheets.
   */
  logEvent: async (username: string, role: string, event: string, status: 'SUCCESS' | 'FAILURE' = 'SUCCESS') => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      username,
      role,
      event,
      status,
      details: navigator.userAgent
    };

    // 1. Persist locally (so it survives refresh)
    const existingLogs = Logger.getLogs();
    const updatedLogs = [entry, ...existingLogs].slice(0, 100); // Keep last 100 entries
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));

    console.log(`[System Log] ${entry.timestamp} - ${username} (${role}): ${event} [${status}]`);

    // 2. Sync to Google Sheet if Webhook is provided
    if (GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        // We use mode: 'no-cors' because Apps Script redirects can sometimes trigger CORS issues in standard mode,
        // but 'no-cors' is fine for fire-and-forget logging.
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry),
        });
        console.debug('Log synced to Google Sheet');
      } catch (error) {
        console.error('Failed to sync log to Google Sheet', error);
      }
    }
  },

  /**
   * Retrieves log entries from local storage.
   */
  getLogs: (): LogEntry[] => {
    try {
      const logs = localStorage.getItem(STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  },

  /**
   * Clears local logs.
   */
  clearLogs: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};