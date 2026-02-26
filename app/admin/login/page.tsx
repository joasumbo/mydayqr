'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Autenticar com Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw new Error('Credenciais inválidas.');

      // 2. Verificar se é admin via API server-side (evita RLS recursivo)
      const res = await fetch('/api/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: authData.session.access_token }),
      });
      const json = await res.json();

      if (!json.isAdmin) {
        await supabase.auth.signOut();
        throw new Error('Acesso negado. Esta conta não tem permissões de administrador.');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo / Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 border border-gray-700 rounded-2xl mb-4 shadow-lg">
            <ShieldCheck size={28} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">MyDay QR — Acesso restrito</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@exemplo.com"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm leading-snug">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-40 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              {loading ? 'A verificar...' : 'Entrar no painel'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Este acesso é exclusivo para administradores.
        </p>
      </div>
    </div>
  );
}
