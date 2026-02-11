
import React from 'react';
import { 
  Users, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'Mon', sales: 4000, visits: 2400 },
  { name: 'Tue', sales: 3000, visits: 1398 },
  { name: 'Wed', sales: 2000, visits: 9800 },
  { name: 'Thu', sales: 2780, visits: 3908 },
  { name: 'Fri', sales: 1890, visits: 4800 },
  { name: 'Sat', sales: 2390, visits: 3800 },
  { name: 'Sun', sales: 3490, visits: 4300 },
];

const DashboardHome = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Overview</h1>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Download Report</button>
          <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700">Add New Product</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Sales', value: '$48,250', change: '+12.5%', icon: <TrendingUp className="text-green-600" />, trend: 'up' },
          { label: 'Active Staff', value: '42 / 45', change: '-2.4%', icon: <Users className="text-blue-600" />, trend: 'down' },
          { label: 'Low Stock Items', value: '18', change: '+5', icon: <AlertTriangle className="text-amber-600" />, trend: 'up' },
          { label: 'Pending Leaves', value: '7', change: '0', icon: <Clock className="text-purple-600" />, trend: 'neutral' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                stat.trend === 'up' ? 'bg-green-100 text-green-700' : 
                stat.trend === 'down' ? 'bg-red-100 text-red-700' : 
                'bg-slate-100 text-slate-700'
              }`}>
                {stat.trend === 'up' && <ArrowUpRight size={12} />}
                {stat.trend === 'down' && <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Weekly Revenue</h2>
            <select className="text-sm border-none bg-slate-100 rounded-lg px-2 py-1 outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Live Alerts</h2>
          <div className="space-y-6">
            {[
              { type: 'stock', title: 'Low Stock Alert', desc: 'Whole Milk (3.5%) is below 15 units.', time: '5m ago', color: 'bg-amber-100 text-amber-700' },
              { type: 'hr', title: 'New Leave Request', desc: 'Sarah Miller requested 3 days off.', time: '12m ago', color: 'bg-blue-100 text-blue-700' },
              { type: 'marketing', title: 'Campaign Performance', desc: 'New Year Sale reach +24% today.', time: '45m ago', color: 'bg-green-100 text-green-700' },
              { type: 'stock', title: 'Expiry Warning', desc: 'Chicken Breast expires in 2 days.', time: '1h ago', color: 'bg-red-100 text-red-700' },
            ].map((alert, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${alert.color.split(' ')[0].replace('bg-', 'bg-')}`}></div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">{alert.title}</h4>
                    <span className="text-[10px] font-medium text-slate-400 uppercase">{alert.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 text-center">View All Notifications</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
