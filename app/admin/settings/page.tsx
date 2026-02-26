'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { adminFetch, adminSave, adminDelete } from '@/lib/admin-data';
import { UserPlus, Trash2, Shield, ShieldCheck } from 'lucide-react';

interface Admin {
  id: string;
  user_id: string | null;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
}

export default function SettingsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [adding, setAdding] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>('admin');

  useEffect(() => {
    fetchAdmins();
    checkCurrentUserRole();
  }, []);

  const checkCurrentUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const data = await adminFetch('admins', { select: 'role', eq: { column: 'user_id', value: user.id } });
      if (data && data[0]) setCurrentUserRole(data[0].role);
    }
  };

  const fetchAdmins = async () => {
    try {
      const data = await adminFetch('admins', { select: '*', order: { column: 'created_at', ascending: true } });
      if (data) setAdmins(data);
    } catch (error) {
      console.error('Erro ao buscar admins:', error);
    }
    setLoading(false);
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail) return;
    setAdding(true);
    try {
      await adminSave('admins', { email: newAdminEmail, name: newAdminName || null, role: 'admin' });
      setNewAdminEmail('');
      setNewAdminName('');
      fetchAdmins();
    } catch (error) {
      console.error('Erro ao adicionar admin:', error);
    }
    setAdding(false);
  };

  const handleRemoveAdmin = async (id: string) => {
    if (!confirm('Tens a certeza que queres remover este administrador?')) return;
    try {
      await adminDelete('admins', id);
      fetchAdmins();
    } catch (error) {
      console.error('Erro ao remover admin:', error);
    }
  };

  const handleToggleRole = async (admin: Admin) => {
    const newRole = admin.role === 'super_admin' ? 'admin' : 'super_admin';
    try {
      await adminSave('admins', { role: newRole }, admin.id);
      fetchAdmins();
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
    }
  };

  const isSuperAdmin = currentUserRole === 'super_admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuracoes</h1>
        <p className="text-gray-500 mt-1">Gerir administradores e configuracoes do sistema</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UserPlus size={20} className="text-gray-500" />
          Adicionar Administrador
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="Email do administrador"
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <input
            type="text"
            value={newAdminName}
            onChange={(e) => setNewAdminName(e.target.value)}
            placeholder="Nome (opcional)"
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <button
            onClick={handleAddAdmin}
            disabled={!newAdminEmail || adding}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {adding ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <UserPlus size={20} />
            )}
            Adicionar
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          O administrador podera aceder ao painel apos fazer login com este email.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Administradores</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {admins.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Nenhum administrador cadastrado</div>
          ) : (
            admins.map((admin) => (
              <div key={admin.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    admin.role === 'super_admin' ? 'bg-amber-100' : 'bg-gray-100'
                  }`}>
                    {admin.role === 'super_admin' ? (
                      <ShieldCheck size={20} className="text-amber-600" />
                    ) : (
                      <Shield size={20} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{admin.name || admin.email.split('@')[0]}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    admin.role === 'super_admin'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                  {isSuperAdmin && (
                    <>
                      <button
                        onClick={() => handleToggleRole(admin)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title={admin.role === 'super_admin' ? 'Remover super admin' : 'Tornar super admin'}
                      >
                        <ShieldCheck size={18} />
                      </button>
                      <button
                        onClick={() => handleRemoveAdmin(admin.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remover administrador"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-blue-700 font-semibold mb-2">Sobre os niveis de acesso</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li><strong>Admin:</strong> Pode gerir produtos, exemplos, conteudo e ver utilizadores.</li>
          <li><strong>Super Admin:</strong> Pode fazer tudo acima + gerir outros administradores.</li>
        </ul>
      </div>
    </div>
  );
}
