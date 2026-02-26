'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Package,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShoppingCart,
  Ticket,
  Globe,
  Code2,
  QrCode,
} from 'lucide-react';

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Encomendas' },
  { href: '/admin/users', icon: Users, label: 'Utilizadores' },
  { href: '/admin/products', icon: Package, label: 'Produtos' },
  { href: '/admin/site', icon: Globe, label: 'Gestão do Site' },
  { href: '/admin/examples', icon: Image, label: 'Exemplos' },
  { href: '/admin/coupons', icon: Ticket, label: 'Cupons' },
  { href: '/admin/settings', icon: Settings, label: 'Configurações' },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/login' || pathname === '/admin/setup') return;
    checkAdmin();
  }, [pathname]);

  // Rotas públicas do admin: sem layout protegido
  if (pathname === '/admin/login' || pathname === '/admin/setup') {
    return <>{children}</>;
  }

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/admin/login');
      return;
    }

    setUser(session.user);

    // Verificar via API server-side (evita RLS recursivo na tabela admins)
    const res = await fetch('/api/admin-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: session.access_token }),
    });
    const json = await res.json();

    if (!json.isAdmin) {
      await supabase.auth.signOut();
      router.push('/admin/login');
    } else {
      setIsAdmin(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-500 mb-2">Não tens permissão para aceder ao painel de administração.</p>
          <Link href="/admin/login" className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Voltar ao Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">MyDay Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Painel de Administração</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive
                    ? 'bg-red-50 text-red-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-red-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.user_metadata?.name || user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <h1 className="text-lg font-bold text-gray-900">MyDay Admin</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-500 hover:text-gray-900"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl pt-16">
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                      isActive
                        ? 'bg-red-50 text-red-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:overflow-auto">
        <div className="lg:hidden h-16" /> {/* Spacer for mobile header */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
