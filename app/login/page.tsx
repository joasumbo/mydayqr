'use client';

import { Suspense, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun, Info } from 'lucide-react';

function LoginPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const h = searchParams.get('hint');
    const e = searchParams.get('email');
    if (h === 'exists') {
      setHint('Esta conta já existe. Insere a tua password para entrar.');
      if (e) setEmail(decodeURIComponent(e));
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.user) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-red-600 to-rose-700 dark:from-gray-900 dark:via-red-900 dark:to-gray-900 px-4 transition-colors">
      {/* Toggle Dark Mode */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        {theme === 'light' ? <Moon className="text-gray-700" size={20} /> : <Sun className="text-yellow-400" size={20} />}
      </button>

      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-3 rounded-2xl text-lg font-bold mb-6 shadow-lg">
            MyDay QR
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Bem-vindo de volta</h1>
          <p className="text-gray-600 dark:text-gray-300">Entre para acessar sua conta</p>
        </div>

        {hint && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl text-blue-700 dark:text-blue-300 text-sm flex items-start gap-2">
            <Info size={16} className="flex-shrink-0 mt-0.5" />
            {hint}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl text-red-600 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Não tem conta?{' '}
          <Link href="/register" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-rose-700 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" /></div>}>
      <LoginPageContent />
    </Suspense>
  );
}
