import React, { useState, useEffect } from 'react';
import Login from './pages/Login.tsx';
import Layout from './components/Layout.tsx';
import DashboardHome from './pages/DashboardHome.tsx';
import InventoryModule from './pages/InventoryModule.tsx';
import MarketingModule from './pages/MarketingModule.tsx';
import StaffHome from './pages/StaffHome.tsx';
import SecurityVault from './pages/SecurityVault.tsx';
import { UserRole, User } from './types.ts';
import { Logger } from './services/logger.ts';
import { InternalDB } from './services/internalDb.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // 1. Initialize local structure
      InternalDB.init();
      
      // 2. Sync with cloud to pull any credentials added from other devices
      await InternalDB.syncFromCloud();
      
      // 3. Check for existing session
      const sessionUser = InternalDB.getSession();
      if (sessionUser) {
        setUser(sessionUser);
        setActiveTab(sessionUser.role === UserRole.ADMIN ? 'dashboard' : 'home');
      }
      
      setIsInitializing(false);
    };

    initializeApp();
  }, []);

  const handleLogin = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    const defaultTab = authenticatedUser.role === UserRole.ADMIN ? 'dashboard' : 'home';
    setActiveTab(defaultTab);
    Logger.logEvent(authenticatedUser.username, authenticatedUser.role, 'Login successful via internal database');
  };

  const handleLogout = async () => {
    if (user) {
      Logger.logEvent(user.username, user.role, 'User logged out');
    }
    InternalDB.clearSession();
    setUser(null);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Synchronizing Secure Vault...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLogin} />;
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
          {activeTab === 'vault' && <SecurityVault />}
          {activeTab === 'hr' && (
            <div className="p-12 text-center text-slate-400">
              <h2 className="text-xl font-bold italic tracking-tight">Internal Personnel Registry</h2>
              <p className="text-sm mt-2">Loading staff records from internal database...</p>
            </div>
          )}
          {activeTab === 'analytics' && (
             <div className="p-12 text-center text-slate-400">
                <h2 className="text-xl font-bold italic tracking-tight">Intelligence Module</h2>
                <p className="text-sm mt-2">Processing local store data...</p>
             </div>
          )}
        </>
      ) : (
        <>
          {activeTab === 'home' && <StaffHome />}
          {activeTab === 'schedule' && (
             <div className="p-12 text-center text-slate-400">
                <h2 className="text-xl font-bold italic tracking-tight">Shift Matrix</h2>
                <p className="text-sm mt-2">Internal scheduling sync in progress...</p>
             </div>
          )}
          {activeTab === 'leave' && (
             <div className="p-12 text-center text-slate-400">
                <h2 className="text-xl font-bold italic tracking-tight">Request Queue</h2>
                <p className="text-sm mt-2">Submit and track local leave requests.</p>
             </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default App;