
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Megaphone, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  X,
  UserCircle
} from 'lucide-react';
import { UserRole } from '../types.ts';

interface LayoutProps {
  user: any;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const adminMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'hr', label: 'HR & Staff', icon: <Users size={20} /> },
    { id: 'inventory', label: 'Inventory', icon: <Package size={20} /> },
    { id: 'marketing', label: 'Marketing', icon: <Megaphone size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  ];

  const staffMenu = [
    { id: 'home', label: 'My Portal', icon: <UserCircle size={20} /> },
    { id: 'schedule', label: 'My Schedule', icon: <LayoutDashboard size={20} /> },
    { id: 'leave', label: 'Leave Requests', icon: <Megaphone size={20} /> },
  ];

  const menuItems = user.role === UserRole.ADMIN ? adminMenu : staffMenu;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col z-50`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          {isSidebarOpen && <span className="font-bold text-slate-800 text-lg">SuperMart</span>}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
            <Settings size={20} />
            {isSidebarOpen && <span>Settings</span>}
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-slate-500 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <Search size={18} />
              <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none text-sm w-64" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-800">{user.fullName}</div>
                <div className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</div>
              </div>
              <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
