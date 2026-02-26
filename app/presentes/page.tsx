'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ShoppingCart, Palette, Coffee, Key, Magnet, Download,
  CheckCircle2, X, Loader2, QrCode, Truck, Zap, Headphones,
  Plus, Minus, Trash2, ChevronRight, Package, MapPin, Mail, User, FileText, Phone,
} from 'lucide-react';

/* ─── Tipos base ─── */
interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  display_order: number;
}

interface CartItem {
  produto: { nome: string; descricao: string; imagem: string | null; price: number; id: string };
  categoria: { id: string; nome: string; cor: string };
  qty: number;
  price: number;
}

type CheckoutStep = 'cart' | 'form' | 'success';

/* ─── Config de categorias (visual) ─── */
const CATEGORY_CONFIG: Record<string, { nome: string; icone: any; cor: string; order: number }> = {
  'decoracao':       { nome: 'Decoracao',        icone: Palette,  cor: 'red',    order: 1 },
  'canecas':         { nome: 'Canecas',           icone: Coffee,   cor: 'amber',  order: 2 },
  'porta-chaves':    { nome: 'Porta-chaves',      icone: Key,      cor: 'blue',   order: 3 },
  'iman-autocolante':{ nome: 'Iman / Autocolante',icone: Magnet,   cor: 'purple', order: 4 },
  'digital':         { nome: 'Digital',           icone: Download, cor: 'green',  order: 5 },
};

const corClasses: Record<string, { text: string }> = {
  red:    { text: 'text-red-600' },
  amber:  { text: 'text-amber-600' },
  blue:   { text: 'text-blue-600' },
  purple: { text: 'text-purple-600' },
  green:  { text: 'text-green-600' },
};

const inferCategory = (product: DbProduct) => {
  const raw = (product.category || '').trim().toLowerCase();
  if (raw in CATEGORY_CONFIG) return raw;

  const normalized = product.name.toLowerCase();
  if (/caneca/.test(normalized)) return 'canecas';
  if (/chaveiro|porta[- ]?chaves?/.test(normalized)) return 'porta-chaves';
  if (/autocolante|iman|íman|sticker/.test(normalized)) return 'iman-autocolante';
  if (/digital|download|png/.test(normalized)) return 'digital';
  return 'decoracao';
};

function PresentesPageContent() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrders, setSubmittedOrders] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' });

  const searchParams = useSearchParams();
  const linkedQR = searchParams.get('qr');

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const bootstrap = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const metadata = (user?.user_metadata || {}) as Record<string, string | undefined>;
      const fullName = metadata.full_name || metadata.name || [metadata.first_name, metadata.last_name].filter(Boolean).join(' ').trim();
      const phone = metadata.phone || user?.phone || '';

      setForm(f => ({
        ...f,
        email: user?.email || f.email,
        name: fullName || f.name,
        phone: phone || f.phone,
      }));

      if (user?.id) {
        const { data: lastOrder } = await supabase
          .from('orders')
          .select('customer_name, customer_email, shipping_address')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (lastOrder) {
          setForm(f => ({
            ...f,
            name: f.name || lastOrder.customer_name || '',
            email: f.email || lastOrder.customer_email || '',
            address: f.address || lastOrder.shipping_address || '',
          }));
        }
      }

      await fetchProducts();
    };

    bootstrap();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (data) {
      const unique = new Map<string, DbProduct>();
      data.forEach((product: DbProduct) => {
        const key = `${product.name.trim().toLowerCase()}::${Number(product.price).toFixed(2)}::${product.image_url || ''}`;
        if (!unique.has(key)) unique.set(key, product);
      });
      setDbProducts(Array.from(unique.values()));
    }

    setLoadingProducts(false);
  };

  /* ─── Construir lista de categorias a partir da BD ─── */
  const categorias = useMemo(() => {
    const catMap = new Map<string, {
      id: string; nome: string; icone: any; cor: string; order: number;
      precoMin: number;
      produtos: { nome: string; descricao: string; imagem: string | null; price: number; id: string }[];
    }>();

    dbProducts.forEach(prod => {
      const slug = inferCategory(prod);
      const cfg = CATEGORY_CONFIG[slug] ?? { nome: slug, icone: Package, cor: 'red', order: 99 };
      if (!catMap.has(slug)) {
        catMap.set(slug, { id: slug, ...cfg, precoMin: prod.price, produtos: [] });
      }
      const cat = catMap.get(slug)!;
      if (prod.price < cat.precoMin) cat.precoMin = prod.price;
      cat.produtos.push({
        nome: prod.name,
        descricao: prod.description || '',
        imagem: prod.image_url,
        price: prod.price,
        id: prod.id,
      });
    });

    return Array.from(catMap.values()).sort((a, b) => a.order - b.order);
  }, [dbProducts]);

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (produto: CartItem['produto'], categoria: CartItem['categoria']) => {
    const key = `${produto.id}-${categoria.id}`;
    setCartItems(prev => {
      const existing = prev.find(i => i.produto.id === produto.id);
      if (existing) return prev.map(i => i.produto.id === produto.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { produto, categoria, qty: 1, price: produto.price }];
    });
    setAddedId(key);
    setTimeout(() => setAddedId(null), 800);
  };

  const updateQty = (prodId: string, delta: number) => {
    setCartItems(prev => prev.map(i => i.produto.id === prodId ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  };

  const removeItem = (prodId: string) => {
    setCartItems(prev => prev.filter(i => i.produto.id !== prodId));
  };

  const handleSubmit = async () => {
    if (!form.email || !form.name || !form.address || !form.phone) {
      showToast('Preenche nome, email, contacto e morada para continuar.');
      return;
    }
    setSubmitting(true);
    try {
      const optionalColumns = new Set(['notes', 'customer_phone']);
      let data: any[] | null = null;
      let error: any = null;

      for (let attempt = 0; attempt < 3; attempt++) {
        const inserts = cartItems.map(item => {
          const row: Record<string, any> = {
            user_id: user?.id || null,
            product_name: item.produto.nome,
            price: item.price,
            customer_email: form.email,
            customer_name: form.name,
            shipping_address: form.address || null,
            status: 'pending',
            short_code: linkedQR || null,
          };

          if (optionalColumns.has('customer_phone')) row.customer_phone = form.phone || null;
          if (optionalColumns.has('notes')) row.notes = form.notes || null;
          return row;
        });

        const result = await supabase.from('orders').insert(inserts).select();
        data = result.data;
        error = result.error;

        if (!error) break;

        const match = error.message?.match(/Could not find the '([^']+)' column/);
        if (!match) break;
        const missingColumn = match[1];
        if (!optionalColumns.has(missingColumn)) break;
        optionalColumns.delete(missingColumn);
      }

      if (error) throw error;

      setSubmittedOrders(data || []);
      setCartItems([]);
      setCheckoutStep('success');
    } catch (err: any) {
      showToast(err?.message || 'Erro ao processar encomenda. Contacta-nos por email.');
    } finally {
      setSubmitting(false);
    }
  };

  const openCart = () => { setCartOpen(true); setCheckoutStep('cart'); };
  const closeCart = () => { setCartOpen(false); if (checkoutStep === 'success') setCheckoutStep('cart'); };

  return (
    <div className="min-h-screen bg-white">

      {toast && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
        }`}>
          <X size={14} className="cursor-pointer opacity-70 hover:opacity-100 flex-shrink-0" onClick={() => setToast(null)} />
          {toast.message}
        </div>
      )}

      {linkedQR && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center gap-2">
            <QrCode size={14} className="text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 text-xs">
              QR Code <span className="font-mono font-semibold bg-amber-100 px-1 rounded">{linkedQR}</span> sera gravado no produto que escolheres
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm mb-8 transition-colors">
            <ArrowLeft size={16} />Voltar
          </Link>
          <div>
            <p className="text-xs font-semibold tracking-widest text-red-500 uppercase mb-2">Loja</p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">MyDay QR</h1>
            <p className="text-gray-500 mt-2 max-w-lg text-sm leading-relaxed">
              Cada peca integra um QR que liga o fisico ao digital — uma mensagem que podes mudar sempre que quiseres.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky nav categorias */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3">
            <button
              onClick={() => setCategoriaAtiva(null)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                categoriaAtiva === null ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >Todos</button>
            {categorias.map((cat) => {
              const Icone = cat.icone;
              return (
                <button key={cat.id} onClick={() => setCategoriaAtiva(cat.id)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                    categoriaAtiva === cat.id ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icone size={14} />{cat.nome}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Catalogo */}
      <div className="max-w-6xl mx-auto px-6 py-12 pb-32">
        {loadingProducts ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : categorias.length === 0 ? (
          <div className="text-center py-32 text-gray-400">
            <Package size={40} className="mx-auto mb-4 opacity-30" />
            <p>Nenhum produto disponivel de momento.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {categorias.filter(cat => categoriaAtiva === null || categoriaAtiva === cat.id).map((categoria) => {
              const cores = corClasses[categoria.cor] ?? { text: 'text-gray-600' };
              const Icone = categoria.icone;
              const precoLabel = `desde ${categoria.precoMin.toFixed(2).replace('.', ',')}€`;
              return (
                <section key={categoria.id} id={categoria.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <Icone size={18} className={cores.text} />
                    <h2 className="text-lg font-semibold text-gray-900">{categoria.nome}</h2>
                    <span className="text-gray-300 text-sm">—</span>
                    <span className="text-sm text-gray-400">{precoLabel}</span>
                    <div className="flex-1 h-px bg-gray-100 ml-2" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {categoria.produtos.map((produto) => {
                      const key = `${produto.id}-${categoria.id}`;
                      const isAdded = addedId === key;
                      const inCart = cartItems.find(i => i.produto.id === produto.id);
                      return (
                        <div key={produto.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-200 bg-white">
                          <div className="aspect-square bg-gray-50 overflow-hidden relative">
                            {produto.imagem ? (
                              <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Download size={32} className="text-gray-300" />
                              </div>
                            )}
                            {inCart && (
                              <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                {inCart.qty}
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{categoria.nome}</p>
                            <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2">{produto.nome}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">{produto.descricao}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-base font-bold text-gray-900">{produto.price.toFixed(2).replace('.', ',')}€</span>
                              <button
                                onClick={() => addToCart(produto, { id: categoria.id, nome: categoria.nome, cor: categoria.cor })}
                                className={`flex items-center gap-1.5 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all ${
                                  isAdded ? 'bg-green-600 scale-95' : 'bg-gray-900 hover:bg-black'
                                }`}
                              >
                                {isAdded ? <CheckCircle2 size={13} /> : <Plus size={13} />}
                                {isAdded ? 'Adicionado!' : 'Adicionar'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="border-t border-gray-100 py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { Icon: Truck, title: 'Envio Portugal', desc: 'Portes incluidos em Portugal Continental' },
              { Icon: Zap, title: 'Producao Rapida', desc: 'Expedido em 3-5 dias uteis' },
              { Icon: Headphones, title: 'Suporte', desc: 'Email ou telefone sempre disponivel' },
            ].map((item) => (
              <div key={item.title}>
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.Icon size={18} className="text-gray-500" />
                </div>
                <p className="font-semibold text-gray-800 text-sm mb-1">{item.title}</p>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-100 py-6 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>MyDay QR — Inpulse Events</span>
          <div className="flex items-center gap-4">
            <a href="mailto:geral.inpulse@gmail.com" className="hover:text-gray-600 transition-colors">geral.inpulse@gmail.com</a>
            <a href="tel:+351913698968" className="hover:text-gray-600 transition-colors">+351 913 698 968</a>
          </div>
        </div>
      </footer>

      {/* Botao flutuante */}
      {totalItems > 0 && !cartOpen && (
        <button
          onClick={openCart}
          className="fixed bottom-6 right-6 z-50 bg-gray-900 hover:bg-black text-white rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-xl transition-all hover:scale-105"
        >
          <ShoppingCart size={20} />
          <span className="font-semibold text-sm">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalPrice.toFixed(2).replace('.', ',')}€</span>
        </button>
      )}

      {/* Drawer do carrinho */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={closeCart} />
          <div className="w-full max-w-md bg-white flex flex-col h-full shadow-2xl">

            {checkoutStep === 'cart' && (
              <>
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">O teu carrinho</h2>
                    <p className="text-xs text-gray-400">{totalItems} {totalItems === 1 ? 'produto' : 'produtos'}</p>
                  </div>
                  <button onClick={closeCart} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={22} /></button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-20">
                      <ShoppingCart size={40} className="text-gray-200" />
                      <p className="text-gray-400 text-sm">O carrinho esta vazio</p>
                      <button onClick={closeCart} className="text-sm text-gray-900 font-semibold hover:underline">Ver produtos</button>
                    </div>
                  ) : cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                        {item.produto.imagem
                          ? <img src={item.produto.imagem} alt={item.produto.nome} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Package size={20} className="text-gray-300" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider">{item.categoria.nome}</p>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{item.produto.nome}</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{(item.price * item.qty).toFixed(2).replace('.', ',')}€</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => removeItem(item.produto.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden">
                          <button onClick={() => updateQty(item.produto.id, -1)} className="px-2 py-1 hover:bg-gray-100 transition-colors text-gray-600">
                            <Minus size={13} />
                          </button>
                          <span className="text-sm font-semibold text-gray-900 w-5 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.produto.id, 1)} className="px-2 py-1 hover:bg-gray-100 transition-colors text-gray-600">
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {cartItems.length > 0 && (
                  <div className="px-6 py-5 border-t border-gray-100 space-y-4">
                    {linkedQR && (
                      <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2">
                        <QrCode size={14} className="text-amber-600" />
                        <p className="text-xs text-amber-700">QR <span className="font-mono font-semibold">{linkedQR}</span> sera associado</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Total</span>
                      <span className="text-xl font-bold text-gray-900">{totalPrice.toFixed(2).replace('.', ',')}€</span>
                    </div>
                    <button
                      onClick={() => setCheckoutStep('form')}
                      className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      Finalizar encomenda <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}

            {checkoutStep === 'form' && (
              <>
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                  <button onClick={() => setCheckoutStep('cart')} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">Dados de entrega</h2>
                    <p className="text-xs text-gray-400">{totalItems} produto(s) · {totalPrice.toFixed(2).replace('.', ',')}€</p>
                  </div>
                  <button onClick={closeCart} className="ml-auto text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.produto.nome} x{item.qty}</span>
                        <span className="font-semibold text-gray-900">{(item.price * item.qty).toFixed(2).replace('.', ',')}€</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm">
                      <span>Total</span><span>{totalPrice.toFixed(2).replace('.', ',')}€</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><User size={12} />Nome completo *</label>
                      <input type="text" placeholder="O teu nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Mail size={12} />Email *</label>
                      <input type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Phone size={12} />Contacto *</label>
                      <input type="tel" placeholder="+351 9xx xxx xxx" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><MapPin size={12} />Morada de entrega *</label>
                      <textarea placeholder="Rua, numero, codigo postal, cidade" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={3}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><FileText size={12} />Notas (opcional)</label>
                      <textarea placeholder="Observacoes ou mensagem personalizada" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all resize-none" />
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    Apos submeter, entraremos em contacto para confirmar o pagamento e envio.
                  </p>
                </div>

                <div className="px-6 py-5 border-t border-gray-100">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !form.name || !form.email || !form.phone || !form.address}
                    className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    {submitting ? 'A processar...' : 'Confirmar encomenda'}
                  </button>
                </div>
              </>
            )}

            {checkoutStep === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-5">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Encomenda confirmada!</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Recebemos {submittedOrders.length} {submittedOrders.length === 1 ? 'produto' : 'produtos'} para <strong className="text-gray-700">{form.email}</strong>.
                    Entraremos em contacto em breve.
                  </p>
                </div>

                {linkedQR && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 w-full">
                    <QrCode size={18} className="text-amber-600 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-amber-800">QR Code associado</p>
                      <p className="font-mono text-amber-700 text-sm font-bold">{linkedQR}</p>
                    </div>
                  </div>
                )}

                <div className="w-full space-y-2 bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Resumo</p>
                  {submittedOrders.map((o, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{o.product_name}</span>
                      <span className="font-semibold">{Number(o.price).toFixed(2).replace('.', ',')}€</span>
                    </div>
                  ))}
                </div>

                <div className="w-full space-y-2 mt-2">
                  <button
                    onClick={() => { closeCart(); setForm(f => ({ ...f, name: '', phone: '', address: '', notes: '' })); }}
                    className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-colors"
                  >Continuar a explorar</button>
                  <Link href="/dashboard" className="w-full py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
                    <QrCode size={15} />Ver os meus QR Codes
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PresentesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    }>
      <PresentesPageContent />
    </Suspense>
  );
}
