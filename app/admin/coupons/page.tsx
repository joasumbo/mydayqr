'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Search, Pencil, Trash2, X, Check, Ticket, Calendar, Tag } from 'lucide-react';
import { adminFetch, adminSave, adminDelete } from '@/lib/admin-data';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  expires_at: string | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    min_purchase_amount: '0',
    expires_at: '',
    usage_limit: '',
    is_active: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await adminFetch('coupons', { order: { column: 'created_at', ascending: false } });
      if (data) setCoupons(data);
    } catch (error) { console.error('Erro ao buscar cupons:', error); }
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      min_purchase_amount: '0',
      expires_at: '',
      usage_limit: '',
      is_active: true
    });
    setShowModal(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      min_purchase_amount: coupon.min_purchase_amount.toString(),
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : '',
      usage_limit: coupon.usage_limit?.toString() || '',
      is_active: coupon.is_active
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.code || !formData.discount_value) return;

    setSaving(true);
    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_purchase_amount: parseFloat(formData.min_purchase_amount) || 0,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        is_active: formData.is_active
      };

      if (editingCoupon) {
        await adminSave('coupons', couponData, editingCoupon.id);
      } else {
        await adminSave('coupons', couponData);
      }

      fetchCoupons();
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres excluir este cupom?')) return;
    try { await adminDelete('coupons', id); fetchCoupons(); } catch (e) { console.error(e); }
  };

  const filteredCoupons = coupons.filter(c =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Cupons de Desconto</h1>
          <p className="text-gray-400 mt-1">{coupons.length} cupons ativos</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Novo Cupom
        </button>
      </div>

      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Pesquisar por código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <Ticket className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{coupon.code}</h3>
                  <p className="text-sm text-gray-400">
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% de desconto` : `${coupon.discount_value}€ de desconto`}
                  </p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${coupon.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {coupon.is_active ? 'Ativo' : 'Inativo'}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Tag size={16} />
                Mínimo: {coupon.min_purchase_amount}€
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={16} />
                Expira: {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Nunca'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Check size={16} />
                Usos: {coupon.usage_count} {coupon.usage_limit ? `/ ${coupon.usage_limit}` : ''}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-700">
              <button 
                onClick={() => handleEdit(coupon)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Pencil size={16} /> Editar
              </button>
              <button 
                onClick={() => handleDelete(coupon.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowModal(false)} />
          <div className="relative bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-700 text-white font-bold text-xl">
              {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Código (ex: AMOR10)</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tipo</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as any })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="percentage">Percentagem (%)</option>
                    <option value="fixed">Fixo (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Valor</label>
                  <input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Data Expiração</label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Limite de Usos</label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
              <button 
                onClick={handleSave}
                disabled={saving || !formData.code}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
