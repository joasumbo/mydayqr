'use client';

import { useState, useEffect } from 'react';
import { adminFetch, adminDelete } from '@/lib/admin-data';
import { Search, QrCode, Calendar, Eye, Trash2 } from 'lucide-react';

interface UserWithQRCodes {
  user_id: string;
  email?: string;
  qrCodes: any[];
  totalQrCodes: number;
  lastActivity: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithQRCodes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithQRCodes | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const qrCodes = await adminFetch('qrcodes', {
        select: '*',
        order: { column: 'created_at', ascending: false }
      });

      if (qrCodes) {
        const userMap = new Map<string, UserWithQRCodes>();
        qrCodes.forEach((qr: any) => {
          if (!userMap.has(qr.user_id)) {
            userMap.set(qr.user_id, {
              user_id: qr.user_id,
              qrCodes: [],
              totalQrCodes: 0,
              lastActivity: qr.created_at
            });
          }
          const user = userMap.get(qr.user_id)!;
          user.qrCodes.push(qr);
          user.totalQrCodes++;
          if (new Date(qr.created_at) > new Date(user.lastActivity)) {
            user.lastActivity = qr.created_at;
          }
        });
        setUsers(Array.from(userMap.values()));
      }
    } catch (error) {
      console.error('Erro ao buscar utilizadores:', error);
    }
    setLoading(false);
  };

  const handleViewUser = (user: UserWithQRCodes) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteQRCode = async (id: string) => {
    if (!confirm('Tens a certeza que queres excluir este QR Code?')) return;
    try {
      await adminDelete('qrcodes', id);
      fetchUsers();
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          qrCodes: selectedUser.qrCodes.filter(qr => qr.id !== id),
          totalQrCodes: selectedUser.totalQrCodes - 1
        });
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.qrCodes.some(qr => qr.phrase.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Utilizadores</h1>
        <p className="text-gray-500 mt-1">{users.length} utilizadores registados</p>
      </div>

      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Pesquisar por ID ou frase..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilizador ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">QR Codes</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ultima Atividade</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    Nenhum utilizador encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-bold text-sm">
                            {user.user_id.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 font-mono text-sm">
                          {user.user_id.substring(0, 12)}...
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <QrCode size={15} className="text-gray-400" />
                        <span className="text-gray-900 font-medium">{user.totalQrCodes}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(user.lastActivity).toLocaleDateString('pt-PT', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">QR Codes do Utilizador</h2>
              <p className="text-sm text-gray-500 mt-1 font-mono">
                {selectedUser.user_id.substring(0, 20)}...
              </p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedUser.qrCodes.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Nenhum QR Code</p>
              ) : (
                <div className="space-y-3">
                  {selectedUser.qrCodes.map((qr) => (
                    <div key={qr.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-medium">{qr.phrase}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="font-mono text-xs">{qr.short_code}</span>
                            <span>{new Date(qr.created_at).toLocaleDateString('pt-PT')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <a
                            href={`/q/${qr.short_code}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </a>
                          <button
                            onClick={() => handleDeleteQRCode(qr.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
