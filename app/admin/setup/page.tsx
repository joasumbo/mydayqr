'use client';

import { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function AdminSetupPage() {
  const [email, setEmail] = useState('ansiao@myday.pt');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setResult({ ok: res.ok, msg: data.message || data.error || 'Resposta desconhecida' });
    } catch {
      setResult({ ok: false, msg: 'Erro de rede.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl mb-4">
            <ShieldCheck size={28} className="text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Setup Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Criar conta de administrador</p>
        </div>

        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3 mb-6">
          <p className="text-yellow-400 text-xs leading-relaxed">
            ⚠️ Esta página é temporária. Após criar o admin, apaga a pasta <code className="bg-yellow-400/10 px-1 rounded">app/admin/setup</code> e <code className="bg-yellow-400/10 px-1 rounded">app/api/admin-setup</code>.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleCreate} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email do admin</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ansiao@myday.pt"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 border ${result.ok ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                {result.ok ? <CheckCircle2 size={15} className="text-green-400 flex-shrink-0 mt-0.5" /> : <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />}
                <p className={`text-sm leading-snug ${result.ok ? 'text-green-400' : 'text-red-400'}`}>{result.msg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              {loading ? 'A criar...' : 'Criar administrador'}
            </button>
          </form>

          {result?.ok && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <a href="/admin/login" className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors text-sm">
                <ShieldCheck size={16} /> Ir para o login do admin
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
