'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import {
  LogOut, Download, Pencil, Trash2, Plus, Check, X, ExternalLink, Copy,
  ArrowLeft, ArrowRight, Image as ImageIcon, QrCode,
  Mail, Printer, MessageCircle, Facebook, Instagram, Package,
} from 'lucide-react';

/* ─── types ─── */
interface QRCodeItem {
  id: string;
  user_id: string;
  phrase: string;
  short_code: string;
  created_at: string;
}
interface Customization {
  darkColor: string;
  lightColor: string;
  centerPhoto: string | null;
}
type Step = 'history' | 'step1' | 'step2' | 'loading' | 'success';

/* ─── QR canvas helper ─── */
async function buildQRDataUrl(
  url: string,
  custom: Customization,
  size = 400
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  await QRCode.toCanvas(canvas, url, {
    width: size,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: custom.darkColor, light: custom.lightColor },
  });
  if (custom.centerPhoto) {
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    img.src = custom.centerPhoto;
    await new Promise<void>((res) => { img.onload = () => res(); img.onerror = () => res(); });
    const cs = size * 0.22;
    const x = (size - cs) / 2;
    const y = (size - cs) / 2;
    ctx.fillStyle = custom.lightColor;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, cs / 2 + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, cs / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, x, y, cs, cs);
    ctx.restore();
  }
  return canvas.toDataURL('image/png');
}

/* ─── Phone Mockup ─── */
function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto select-none" style={{ width: 240, height: 480 }}>
      <div className="absolute inset-0 rounded-[40px] shadow-2xl" style={{ background: '#1a1a2e', border: '7px solid #111' }} />
      <div className="absolute left-[-9px] top-20 w-2 h-8 bg-gray-700 rounded-l-full" />
      <div className="absolute left-[-9px] top-32 w-2 h-12 bg-gray-700 rounded-l-full" />
      <div className="absolute left-[-9px] top-48 w-2 h-12 bg-gray-700 rounded-l-full" />
      <div className="absolute right-[-9px] top-28 w-2 h-16 bg-gray-700 rounded-r-full" />
      <div className="absolute inset-[7px] rounded-[33px] bg-white overflow-hidden flex flex-col">
        <div className="flex justify-center pt-3 pb-1 bg-white">
          <div className="w-24 h-5 bg-gray-900 rounded-full" />
        </div>
        <div className="flex-1 overflow-hidden flex items-center justify-center px-2 pb-3">
          {children}
        </div>
        <div className="flex justify-center pb-2 bg-white">
          <div className="w-20 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ─── Step progress bar ─── */
const STEPS_LABELS = ['Conteúdo', 'Personalizar', 'Criar'];
function StepBar({ current }: { current: 0 | 1 | 2 }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${done ? 'bg-green-500 border-green-500 text-white' : active ? 'bg-red-600 border-red-600 text-white ring-4 ring-red-100' : 'bg-white border-gray-300 text-gray-400'}`}>
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs mt-1 font-semibold ${active ? 'text-red-600' : done ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
            </div>
            {i < STEPS_LABELS.length - 1 && (
              <div className={`h-0.5 w-14 mx-1 mb-4 transition-all ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Component ─── */
export default function DashboardPage() {
  /* auth */
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  /* data */
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});

  /* flow */
  const [step, setStep] = useState<Step>('history');

  /* step 1 */
  const [phrase, setPhrase] = useState('');

  /* step 2 */
  const [customization, setCustomization] = useState<Customization>({ darkColor: '#000000', lightColor: '#ffffff', centerPhoto: null });
  const [livePreview, setLivePreview] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  /* success */
  const [createdQR, setCreatedQR] = useState<{ dataUrl: string; shortCode: string } | null>(null);

  /* history editing */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPhrase, setEditPhrase] = useState('');

  /* toast */
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  /* ── boot ── */
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return; }
      setUser(user);
      fetchQRCodes();
    });
  }, []);

  /* ── history thumbnails ── */
  useEffect(() => {
    qrCodes.forEach(async (qr) => {
      if (!qrImages[qr.short_code]) {
        const url = `${window.location.origin}/q/${qr.short_code}`;
        const dataUrl = await buildQRDataUrl(url, { darkColor: '#000', lightColor: '#fff', centerPhoto: null }, 200);
        setQrImages((p) => ({ ...p, [qr.short_code]: dataUrl }));
      }
    });
  }, [qrCodes]);

  /* ── live preview in step 2 ── */
  useEffect(() => {
    if (step !== 'step2') return;
    const fakeUrl = `${window.location.origin}/q/preview`;
    buildQRDataUrl(fakeUrl, customization, 300).then(setLivePreview);
  }, [customization, step]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchQRCodes = async () => {
    const { data } = await supabase.from('qrcodes').select('*').order('created_at', { ascending: false });
    if (data) setQrCodes(data);
  };

  /* ── CREATE ── */
  const handleCreate = async () => {
    if (!phrase.trim() || !user) return;
    setStep('loading');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { showToast('error', 'Sessão expirada'); setStep('step2'); return; }
      const response = await fetch('/api/qrcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ phrase: phrase.trim() }),
      });
      const data = await response.json();
      if (!response.ok) { showToast('error', data.error || 'Erro ao criar'); setStep('step2'); return; }
      const publicUrl = `${window.location.origin}/q/${data.short_code}`;
      const dataUrl = await buildQRDataUrl(publicUrl, customization, 500);
      setCreatedQR({ dataUrl, shortCode: data.short_code });
      fetchQRCodes();
      setStep('success');
    } catch {
      showToast('error', 'Erro ao criar QR code');
      setStep('step2');
    }
  };

  /* ── UPDATE ── */
  const handleUpdate = async (id: string) => {
    if (!editPhrase.trim()) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch('/api/qrcodes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ id, phrase: editPhrase.trim() }),
    });
    if (res.ok) {
      setEditingId(null);
      fetchQRCodes();
      showToast('success', 'Atualizado!');
      return;
    }
    const json = await res.json().catch(() => null);
    showToast('error', json?.error || 'Não foi possível atualizar este QR');
  };

  /* ── DELETE ── */
  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este QR Code?')) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch(`/api/qrcodes?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${session.access_token}` } });
    if (res.ok) {
      fetchQRCodes();
      showToast('success', 'Excluído!');
      return;
    }
    const json = await res.json().catch(() => null);
    showToast('error', json?.error || 'Não foi possível excluir este QR');
  };

  const handleDownload = (shortCode: string, imgUrl?: string) => {
    const url = imgUrl || qrImages[shortCode];
    if (!url) return;
    const link = document.createElement('a');
    link.download = `qrcode-${shortCode}.png`;
    link.href = url;
    link.click();
    showToast('success', 'Download iniciado!');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCustomization((p) => ({ ...p, centerPhoto: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const copyLink = (shortCode: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/q/${shortCode}`);
    showToast('success', 'Link copiado!');
  };

  const resetCreation = () => {
    setPhrase('');
    setCustomization({ darkColor: '#000000', lightColor: '#ffffff', centerPhoto: null });
    setCreatedQR(null);
    setStep('history');
  };

  const publicUrl = createdQR ? `${typeof window !== 'undefined' ? window.location.origin : ''}/q/${createdQR.shortCode}` : '';

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 transition-all ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}{toast.text}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">MyDay QR</h1>
          <div className="flex items-center gap-3">
            {(step === 'step1' || step === 'step2') && (
              <button onClick={resetCreation} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
                <X size={16} /> Cancelar
              </button>
            )}
            <span className="text-sm text-gray-500 hidden sm:block">{user?.user_metadata?.name || user?.email?.split('@')[0]}</span>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ══ STEP 1 ══ */}
      {step === 'step1' && (
        <main className="max-w-2xl mx-auto px-4 py-10">
          <StepBar current={0} />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Adicionar conteúdo</h2>
            <p className="text-gray-500 text-sm mb-6">Escreve a mensagem que aparecerá quando o QR for lido.</p>
            <textarea
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="Ex: Obrigado por seres sempre o meu maior apoio ❤️"
              rows={5}
              maxLength={500}
              autoFocus
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 text-lg"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{phrase.length}/500</p>
            <div className="flex justify-between mt-6">
              <button onClick={resetCreation} className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50">
                <ArrowLeft size={16} /> Cancelar
              </button>
              <button onClick={() => setStep('step2')} disabled={!phrase.trim()} className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                Seguinte <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ══ STEP 2 ══ */}
      {step === 'step2' && (
        <main className="max-w-5xl mx-auto px-4 py-10">
          <StepBar current={1} />
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left – phone mockup */}
            <div className="flex flex-col items-center gap-3 lg:sticky lg:top-24">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Pré-visualização</p>
              <PhoneMockup>
                {livePreview ? (
                  <div className="flex flex-col items-center p-2 w-full">
                    <div className="bg-gradient-to-r from-red-600 to-rose-600 w-full py-1.5 rounded-t-lg text-center mb-2">
                      <span className="text-white text-[8px] font-bold tracking-wide">MyDay QR</span>
                    </div>
                    <img src={livePreview} alt="preview" className="w-full rounded" />
                    <p className="text-[6px] text-gray-500 mt-2 text-center line-clamp-2 px-1 leading-relaxed">{phrase}</p>
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-gray-100 rounded-lg animate-pulse" />
                )}
              </PhoneMockup>
              <p className="text-xs text-gray-400 text-center max-w-[200px]">Actualiza em tempo real conforme personalizas</p>
            </div>

            {/* Right – panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Personalizar QR Code</h2>
                <p className="text-sm text-gray-500">Cores e foto central do teu QR.</p>
              </div>

              {/* dark color */}
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-red-200 transition-colors">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Cor do código</p>
                  <p className="text-xs text-gray-400">Cor dos módulos QR</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-mono uppercase">{customization.darkColor}</span>
                  <label className="cursor-pointer relative">
                    <div className="w-10 h-10 rounded-xl border-2 border-gray-200 shadow-sm" style={{ backgroundColor: customization.darkColor }} />
                    <input type="color" value={customization.darkColor} onChange={(e) => setCustomization((p) => ({ ...p, darkColor: e.target.value }))} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </label>
                </div>
              </div>

              {/* light color */}
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-red-200 transition-colors">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Cor de fundo</p>
                  <p className="text-xs text-gray-400">Fundo do QR Code</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-mono uppercase">{customization.lightColor}</span>
                  <label className="cursor-pointer relative">
                    <div className="w-10 h-10 rounded-xl border-2 border-gray-200 shadow-sm" style={{ backgroundColor: customization.lightColor }} />
                    <input type="color" value={customization.lightColor} onChange={(e) => setCustomization((p) => ({ ...p, lightColor: e.target.value }))} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </label>
                </div>
              </div>

              {/* center photo */}
              <div className="p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Foto central</p>
                    <p className="text-xs text-gray-400">Aparece no centro do QR (usa foto tua ou do casal)</p>
                  </div>
                  {customization.centerPhoto && (
                    <button onClick={() => setCustomization((p) => ({ ...p, centerPhoto: null }))} className="text-gray-400 hover:text-red-500 p-1">
                      <X size={16} />
                    </button>
                  )}
                </div>
                {customization.centerPhoto ? (
                  <div className="flex items-center gap-3">
                    <img src={customization.centerPhoto} alt="foto" className="w-14 h-14 rounded-full object-cover ring-2 ring-red-200" />
                    <button onClick={() => photoInputRef.current?.click()} className="text-sm text-red-600 hover:underline">Alterar foto</button>
                  </div>
                ) : (
                  <button onClick={() => photoInputRef.current?.click()} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-red-300 hover:text-red-500 transition-all flex flex-col items-center gap-1">
                    <ImageIcon size={22} />
                    <span className="text-sm font-medium">Adicionar foto</span>
                    <span className="text-xs">JPG, PNG, GIF até 5MB</span>
                  </button>
                )}
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>

              {/* quick themes */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Temas rápidos</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { dark: '#e11d48', light: '#fff1f2', label: 'Rosa' },
                    { dark: '#1d4ed8', light: '#eff6ff', label: 'Azul' },
                    { dark: '#16a34a', light: '#f0fdf4', label: 'Verde' },
                    { dark: '#d97706', light: '#fffbeb', label: 'Âmbar' },
                    { dark: '#7c3aed', light: '#f5f3ff', label: 'Roxo' },
                    { dark: '#000000', light: '#ffffff', label: 'Classic' },
                  ].map((t) => (
                    <button key={t.dark} onClick={() => setCustomization((p) => ({ ...p, darkColor: t.dark, lightColor: t.light }))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${customization.darkColor === t.dark ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50'}`}>
                      <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: t.dark }} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* buttons */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button onClick={() => setStep('step1')} className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all">
                  <ArrowLeft size={16} /> Anterior
                </button>
                <button onClick={handleCreate} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md">
                  <QrCode size={18} /> Criar QR Code
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ══ LOADING ══ */}
      {step === 'loading' && (
        <main className="min-h-[75vh] flex flex-col items-center justify-center gap-4 px-4">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full border-4 border-red-100" />
            <div className="absolute inset-0 rounded-full border-4 border-t-red-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <QrCode size={40} className="text-red-600 opacity-60" />
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-800">A criar o teu QR Code…</p>
          <p className="text-sm text-gray-400">Aguarda um momento</p>
        </main>
      )}

      {/* ══ SUCCESS ══ */}
      {step === 'success' && createdQR && (
        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2 rounded-full text-sm font-semibold border border-green-200 mb-4">
              <Check size={16} /> QR Code criado com sucesso!
            </div>
            <h2 className="text-3xl font-bold text-gray-900">O teu QR Code está pronto</h2>
            <p className="text-gray-500 mt-1">Partilha, faz download ou imprime</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Phone */}
            <div className="flex flex-col items-center gap-3">
              <PhoneMockup>
                <div className="flex flex-col items-center p-2 w-full">
                  <div className="bg-gradient-to-r from-red-600 to-rose-600 w-full py-1.5 rounded-t-lg text-center mb-2">
                    <span className="text-white text-[8px] font-bold tracking-wide">MyDay QR</span>
                  </div>
                  <img src={createdQR.dataUrl} alt="QR" className="w-full rounded" />
                  <p className="text-[6px] text-gray-500 mt-2 text-center line-clamp-3 px-1">{phrase}</p>
                </div>
              </PhoneMockup>
              <p className="text-xs text-gray-400">Pré-visualização ao escanear</p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {/* Share grid */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Partilhar</p>
                <div className="grid grid-cols-3 gap-3">
                  <a href={`https://wa.me/?text=${encodeURIComponent('Olha o meu QR especial 💌 ' + publicUrl)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:bg-green-50 hover:border-green-200 transition-all">
                    <MessageCircle size={22} className="text-green-600" />
                    <span className="text-xs font-medium text-gray-600">WhatsApp</span>
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all">
                    <Facebook size={22} className="text-blue-600" />
                    <span className="text-xs font-medium text-gray-600">Facebook</span>
                  </a>
                  <button onClick={() => { handleDownload(createdQR.shortCode, createdQR.dataUrl); window.open('https://www.instagram.com/', '_blank'); }} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:bg-pink-50 hover:border-pink-200 transition-all">
                    <Instagram size={22} className="text-pink-600" />
                    <span className="text-xs font-medium text-gray-600">Instagram</span>
                  </button>
                  <a href={`mailto:?subject=O meu QR Code MyDay&body=Olá! O meu QR especial: ${publicUrl}`} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all">
                    <Mail size={22} className="text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">Email</span>
                  </a>
                  <button onClick={() => handleDownload(createdQR.shortCode, createdQR.dataUrl)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:bg-red-50 hover:border-red-200 transition-all">
                    <Download size={22} className="text-red-600" />
                    <span className="text-xs font-medium text-gray-600">Download</span>
                  </button>
                  <button onClick={() => {
                    const w = window.open('', '_blank');
                    if (!w) return;
                    w.document.write(`<!DOCTYPE html><html><head><title>MyDay QR</title></head><body style="text-align:center;padding:40px;font-family:sans-serif"><h2 style="color:#dc2626">MyDay QR</h2><img src="${createdQR.dataUrl}" style="width:280px;margin:16px 0"/><p style="color:#6b7280;font-size:14px">${phrase}</p></body></html>`);
                    w.document.close();
                    setTimeout(() => w.print(), 500);
                  }} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all">
                    <Printer size={22} className="text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">Imprimir</span>
                  </button>
                </div>
              </div>

              {/* Link */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">Link público</p>
                  <p className="text-sm text-gray-700 truncate font-mono">{publicUrl}</p>
                </div>
                <button onClick={() => copyLink(createdQR.shortCode)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0" title="Copiar">
                  <Copy size={18} className="text-gray-400" />
                </button>
              </div>

              <a
                href={`/presentes?qr=${createdQR.shortCode}`}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-center"
              >
                <Package size={18} />
                Imprimir num produto
              </a>
              <button onClick={resetCreation} className="w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all">
                ← Ver todos os meus QR Codes
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ══ HISTORY ══ */}
      {step === 'history' && (
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Os meus QR Codes</h2>
              <p className="text-sm text-gray-500">{qrCodes.length} {qrCodes.length === 1 ? 'criado' : 'criados'}</p>
            </div>
            <button onClick={() => setStep('step1')} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-sm transition-all">
              <Plus size={18} /> Novo QR Code
            </button>
          </div>

          {qrCodes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <QrCode size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">Ainda não tens QR Codes</p>
              <p className="text-sm text-gray-400 mb-5">Cria o teu primeiro em segundos</p>
              <button onClick={() => setStep('step1')} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all">
                Criar primeiro QR
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {qrCodes.map((qr) => (
                <div key={qr.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  {/* preview header */}
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 flex justify-center border-b border-red-50">
                    {qrImages[qr.short_code] ? (
                      <img src={qrImages[qr.short_code]} alt="QR" className="w-28 h-28 rounded-lg shadow-sm" />
                    ) : (
                      <div className="w-28 h-28 bg-white/60 rounded-lg animate-pulse" />
                    )}
                  </div>
                  {/* body */}
                  <div className="p-4">
                    {editingId === qr.id ? (
                      <div className="space-y-2">
                        <textarea value={editPhrase} onChange={(e) => setEditPhrase(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-red-500 resize-none" />
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdate(qr.id)} className="flex-1 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 font-medium">Salvar</button>
                          <button onClick={() => { setEditingId(null); setEditPhrase(''); }} className="flex-1 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 font-medium">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-800 font-medium text-sm line-clamp-2 mb-1">{qr.phrase}</p>
                        <p className="text-xs text-gray-400">{new Date(qr.created_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-50">
                          <button onClick={() => copyLink(qr.short_code)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Copiar link"><Copy size={15} /></button>
                          <a href={`/q/${qr.short_code}`} target="_blank" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Ver"><ExternalLink size={15} /></a>
                          <button onClick={() => handleDownload(qr.short_code)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download"><Download size={15} /></button>
                          <button onClick={() => { setEditingId(qr.id); setEditPhrase(qr.phrase); }} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Editar"><Pencil size={15} /></button>
                          <button onClick={() => handleDelete(qr.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto" title="Excluir"><Trash2 size={15} /></button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}