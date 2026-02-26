'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Package, QrCode, TrendingUp, ArrowUpRight, ShoppingCart, Clock, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { adminFetch } from '@/lib/admin-data';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface Stats {
  totalUsers: number;
  totalQrCodes: number;
  totalProducts: number;
  totalOrders: number;
  recentOrders: any[];
  recentQrCodes: any[];
  orderData: any[];
  productData: any[];
  deltaUsers: string;
  deltaQr: string;
  deltaOrders: string;
  deltaConversion: string;
  deltaUsersPositive: boolean;
  deltaQrPositive: boolean;
  deltaOrdersPositive: boolean;
  deltaConversionPositive: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalQrCodes: 0,
    totalProducts: 0,
    totalOrders: 0,
    recentOrders: [],
    recentQrCodes: [],
    orderData: [],
    productData: [],
    deltaUsers: '—',
    deltaQr: '—',
    deltaOrders: '—',
    deltaConversion: '—',
    deltaUsersPositive: true,
    deltaQrPositive: true,
    deltaOrdersPositive: true,
    deltaConversionPositive: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [qrData, productData, orderData] = await Promise.all([
        adminFetch('qrcodes', { select: '*', order: { column: 'created_at', ascending: false } }),
        adminFetch('products', { select: '*' }),
        adminFetch('orders', { select: '*', order: { column: 'created_at', ascending: false } }),
      ]);

      const allQrCodes: any[] = qrData || [];
      const allOrders: any[] = orderData || [];
      const uniqueUserIds = new Set(allQrCodes.map((u: any) => u.user_id));

      // Deltas semana a semana
      const now = Date.now();
      const day = 86400000;
      const inRange = (iso: string, msAgo: number, msAgoEnd: number) => {
        const t = new Date(iso).getTime();
        return t >= now - msAgo && t < now - msAgoEnd;
      };

      const qrThisWeek  = allQrCodes.filter(q => inRange(q.created_at, 7*day, 0)).length;
      const qrLastWeek  = allQrCodes.filter(q => inRange(q.created_at, 14*day, 7*day)).length;
      const ordThisWeek = allOrders.filter(o => inRange(o.created_at, 7*day, 0)).length;
      const ordLastWeek = allOrders.filter(o => inRange(o.created_at, 14*day, 7*day)).length;
      const usrThisWeek = new Set(allQrCodes.filter(q => inRange(q.created_at, 7*day, 0)).map(q => q.user_id)).size;
      const usrLastWeek = new Set(allQrCodes.filter(q => inRange(q.created_at, 14*day, 7*day)).map(q => q.user_id)).size;

      const pct = (cur: number, prev: number) => {
        if (prev === 0) return cur > 0 ? { label: 'novo', positive: true } : { label: '—', positive: true };
        const v = Math.round(((cur - prev) / prev) * 100);
        return { label: (v >= 0 ? '+' : '') + v + '%', positive: v >= 0 };
      };

      const dUsers = pct(usrThisWeek, usrLastWeek);
      const dQr    = pct(qrThisWeek, qrLastWeek);
      const dOrd   = pct(ordThisWeek, ordLastWeek);
      const convNow  = usrThisWeek > 0 ? (ordThisWeek / usrThisWeek) * 100 : 0;
      const convPrev = usrLastWeek > 0 ? (ordLastWeek / usrLastWeek) * 100 : 0;
      const dConv = pct(Math.round(convNow), Math.round(convPrev));

      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
      }).reverse();

      const ordersByDay = last7Days.map(day => {
        const total = allOrders.filter((o: any) =>
          new Date(o.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }) === day
        ).reduce((sum: number, o: any) => sum + Number(o.price || 0), 0);
        return { name: day, valor: total };
      });

      const productDistribution = allOrders.slice(0, 20).reduce((acc: any, order: any) => {
        if (order.product_name) acc[order.product_name] = (acc[order.product_name] || 0) + 1;
        return acc;
      }, {});
      const pieData = Object.entries(productDistribution).map(([name, value]) => ({ name, value }));

      setStats({
        totalUsers: uniqueUserIds.size,
        totalQrCodes: allQrCodes.length,
        totalProducts: (productData || []).length,
        totalOrders: allOrders.length,
        recentOrders: allOrders.slice(0, 5),
        recentQrCodes: allQrCodes.slice(0, 5),
        orderData: ordersByDay,
        productData: pieData.length > 0 ? pieData : [{ name: 'Sem dados', value: 1 }],
        deltaUsers: dUsers.label,
        deltaQr: dQr.label,
        deltaOrders: dOrd.label,
        deltaConversion: dConv.label,
        deltaUsersPositive: dUsers.positive,
        deltaQrPositive: dQr.positive,
        deltaOrdersPositive: dOrd.positive,
        deltaConversionPositive: dConv.positive,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
    setLoading(false);
  };

  const statCards = [
    {
      title: 'Utilizadores',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: stats.deltaUsers,
      positive: stats.deltaUsersPositive,
      tooltip: 'vs semana anterior'
    },
    {
      title: 'QR Codes',
      value: stats.totalQrCodes,
      icon: QrCode,
      color: 'bg-green-500',
      change: stats.deltaQr,
      positive: stats.deltaQrPositive,
      tooltip: 'vs semana anterior'
    },
    {
      title: 'Encomendas',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-amber-500',
      change: stats.deltaOrders,
      positive: stats.deltaOrdersPositive,
      tooltip: 'vs semana anterior'
    },
    {
      title: 'Taxa Conversao',
      value: stats.totalUsers > 0 ? Math.round((stats.totalOrders / stats.totalUsers) * 100) + '%' : '0%',
      icon: TrendingUp,
      color: 'bg-red-500',
      change: stats.deltaConversion,
      positive: stats.deltaConversionPositive,
      tooltip: 'vs semana anterior'
    }
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do MyDay QR</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <div
                title={stat.tooltip}
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {stat.positive ? <ArrowUpRight size={13} /> : <ArrowUpRight size={13} className="rotate-90" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-red-600" />
              Volume de Vendas (7 dias)
            </h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.orderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}€`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ef4444' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Mix Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PieChartIcon size={20} className="text-blue-600" />
              Mix de Produtos
            </h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.productData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Encomendas Recentes</h2>
            <Link href="/admin/orders" className="text-red-600 hover:text-red-700 text-sm font-medium">Ver todas</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <ShoppingCart size={40} className="mx-auto mb-3 opacity-20" />
                <p>Nenhuma encomenda recebida</p>
              </div>
            ) : (
              stats.recentOrders.map((order: any) => (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 font-medium">{order.product_name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{order.customer_email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600 font-bold">{Number(order.price || 0).toFixed(2)}€</p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent QR Codes */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Últimos QR Codes</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentQrCodes.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <QrCode size={40} className="mx-auto mb-3 opacity-20" />
                <p>Nenhum QR code criado ainda</p>
              </div>
            ) : (
              stats.recentQrCodes.map((qr: any) => (
                <div key={qr.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium truncate">{qr.phrase}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Clock size={12} />
                        {new Date(qr.created_at).toLocaleDateString('pt-PT')}
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {qr.short_code}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <ShoppingCart size={20} className="text-amber-600" />
              <span className="text-gray-700">Gerir Encomendas</span>
              <ArrowUpRight size={16} className="ml-auto text-gray-400 group-hover:text-gray-700 transition-colors" />
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <Package size={20} className="text-purple-600" />
              <span className="text-gray-700">Gerir Produtos</span>
              <ArrowUpRight size={16} className="ml-auto text-gray-400 group-hover:text-gray-700 transition-colors" />
            </Link>
            <Link
              href="/admin/site"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <TrendingUp size={20} className="text-green-600" />
              <span className="text-gray-700">Gestão do Site</span>
              <ArrowUpRight size={16} className="ml-auto text-gray-400 group-hover:text-gray-700 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
