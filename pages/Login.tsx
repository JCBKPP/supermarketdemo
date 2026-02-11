
import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200/50 rotate-3">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 pt-4">SuperMart</h1>
            <p className="text-slate-400 font-medium">Enterprise Management Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Staff ID / Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-slate-800"
                  placeholder="Enter your ID"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-slate-800"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                <ShieldCheck size={18} className="rotate-180" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  SECURE LOGIN...
                </>
              ) : (
                <>
                  <LogIn size={24} />
                  SIGN IN
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
              <input type="checkbox" className="rounded border-slate-200 text-blue-600" />
              Remember me
            </label>
            <a href="#" className="hover:text-blue-600 underline underline-offset-4 decoration-slate-200">Forgot credentials?</a>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[2px]">
            Enterprise Grade Security Active &copy; 2024 SuperMart
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
