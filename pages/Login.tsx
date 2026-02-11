import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Loader2, ShieldCheck, Github } from 'lucide-react';
import { authService } from '../services/supabase.ts';

interface LoginProps {
  onLogin: (username: string, role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call for mock users
    setTimeout(() => {
      if (username === 'admin' && password === '123') {
        onLogin(username, 'ADMIN');
      } else if (username === '001' && password === '123') {
        onLogin(username, 'STAFF');
      } else {
        setError('Invalid credentials. Hint: use admin/123 or 001/123');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleGitHubLogin = async () => {
    setIsGitHubLoading(true);
    try {
      await authService.signInWithGitHub();
    } catch (err: any) {
      setError(err.message || 'GitHub Authentication failed');
      setIsGitHubLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="p-8 md:p-12 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200/50 rotate-3">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 pt-4">SuperMart</h1>
            <p className="text-slate-400 font-medium text-sm uppercase tracking-widest">Enterprise Management</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleGitHubLogin}
              disabled={isGitHubLoading}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isGitHubLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Github size={20} />
              )}
              Continue with GitHub
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or staff id</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Staff ID</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-slate-800 text-sm"
                  placeholder="ID Number"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Password</label>
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
                ) : (
                  <LogIn size={20} />
                )}
                INTERNAL SIGN IN
              </button>
            </form>
          </div>

          <div className="flex items-center justify-between text-[10px] font-black text-slate-400 px-1 pt-2">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
              <input type="checkbox" className="rounded border-slate-200 text-blue-600" />
              STAY LOGGED IN
            </label>
            <a href="#" className="hover:text-blue-600 underline underline-offset-4 decoration-slate-200">RECOVERY</a>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[2px]">
            Enterprise Shield Active &copy; 2024
          </p>
        </div>
      </div>
    </div>
  );
};

const AlertCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

export default Login;