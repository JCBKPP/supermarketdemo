
import React, { useState } from 'react';
import Login from './pages/Login.tsx';
import Layout from './components/Layout.tsx';
import DashboardHome from './pages/DashboardHome.tsx';
import InventoryModule from './pages/InventoryModule.tsx';
import MarketingModule from './pages/MarketingModule.tsx';
import StaffHome from './pages/StaffHome.tsx';
import { UserRole, User } from './types.ts';
import { ADMIN_USER, STAFF_USER } from './constants.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (username: string, role: string) => {
    if (role === 'ADMIN') {
      setUser(ADMIN_USER);
      setActiveTab('dashboard');
    } else {
      setUser(STAFF_USER);
      setActiveTab('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

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
              <h2 className="text-xl font-bold">HR Module</h2>
              <p>Section coming soon in next release.</p>
            </div>
          )}
          {activeTab === 'analytics' && (
             <div className="p-12 text-center text-slate-400">
                <h2 className="text-xl font-bold">Analytics Reports</h2>
                <p>Advanced data visuals coming soon.</p>
             </div>
          )}
        </>
      ) : (
        <>
          {activeTab === 'home' && <StaffHome />}
          {activeTab === 'schedule' && (
             <div className="p-12 text-center text-slate-400">
                <h2 className="text-xl font-bold">My Schedule</h2>
                <p>Detailed calendar view coming soon.</p>
             </div>
          )}
          {activeTab === 'leave' && (
             <div className="p-12 text-center text-slate-400">
                <h2 className="text-xl font-bold">Leave Requests</h2>
                <p>Request form coming soon.</p>
             </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
