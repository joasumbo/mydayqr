'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Save,
  Check,
  RefreshCw,
  Globe,
  Palette,
  Code2,
  Eye,
  Type,
  AlertCircle,
  Copy,
  ExternalLink,
  Loader2,
  Monitor,
  Smartphone,
  Home,
  Users,
  Star,
  Phone,
  FileText,
} from 'lucide-react';

import { adminFetch, adminSave } from '@/lib/admin-data';

type Tab = 'textos' | 'cores' | 'codigo' | 'preview';

interface ConfigItem {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  label: string;
  description: string;
}

const textCategories = [
  { id: 'hero', label: 'Hero / Cabeçalho', icon: Home },
  { id: 'para_quem', label: 'Para quem é', icon: Users },
  { id: 'diferencial', label: 'Diferencial', icon: Star },
  { id: 'contact', label: 'Contacto', icon: Phone },
  { id: 'footer', label: 'Rodapé', icon: FileText },
];

const colorKeys = [
  { key: 'brand_primary', label: 'Cor Primária', desc: 'Botões, links, ícones principais' },
  { key: 'brand_secondary', label: 'Cor Secundária', desc: 'Hovers, destaques secundários' },
  { key: 'brand_gradient_from', label: 'Gradiente (início)', desc: 'Cor inicial dos fundos gradiente' },
  { key: 'brand_gradient_to', label: 'Gradiente (fim)', desc: 'Cor final dos fundos gradiente' },
];

export default function SitePage() {
  const [activeTab, setActiveTab] = useState<Tab>('textos');
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTextCat, setActiveTextCat] = useState('hero');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Código CSS/JS injectável
  const [customCSS, setCustomCSS] = useState('');
  const [customJS, setCustomJS] = useState('');
  const [cssChanged, setCssChanged] = useState(false);
  const [jsChanged, setJsChanged] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    const data = await adminFetch('site_config', { order: { column: 'category' } }).catch(() => null);
    if (data) {
      setConfigs(data);
      const cssRow = data.find((d: ConfigItem) => d.key === 'custom_css');
      const jsRow = data.find((d: ConfigItem) => d.key === 'custom_js');
      if (cssRow) setCustomCSS(cssRow.value || '');
      if (jsRow) setCustomJS(jsRow.value || '');
    }
    setLoading(false);
  };

  const getValue = (key: string) => {
    if (key in changes) return changes[key];
    return configs.find(c => c.key === key)?.value || '';
  };

  const handleChange = (key: string, value: string) => {
    setChanges(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const allChanges = { ...changes };
      if (cssChanged) allChanges['custom_css'] = customCSS;
      if (jsChanged) allChanges['custom_js'] = customJS;

      for (const [key, value] of Object.entries(allChanges)) {
        const exists = configs.find(c => c.key === key);
        if (exists) {
          await adminSave('site_config', { value, updated_at: new Date().toISOString() }, exists.id);
        } else {
          await adminSave('site_config', { key, value, type: 'text', category: 'custom', label: key, description: '' });
        }
      }
      setChanges({});
      setCssChanged(false);
      setJsChanged(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      fetchConfigs();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const hasUnsaved = Object.keys(changes).length > 0 || cssChanged || jsChanged;

  const textConfigs = configs.filter(c => c.category === activeTextCat && c.type !== 'color');
  const colorConfigs = colorKeys;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'textos', label: 'Textos', icon: <Type size={16} /> },
    { id: 'cores', label: 'Cores', icon: <Palette size={16} /> },
    { id: 'codigo', label: 'CSS / JS', icon: <Code2 size={16} /> },
    { id: 'preview', label: 'Preview', icon: <Eye size={16} /> },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
            <Globe size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Gestão do Site</h1>
            <p className="text-xs text-gray-400">Textos, cores, código e pré-visualização</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ExternalLink size={14} />
            Ver site
          </a>
          {hasUnsaved && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : <Save size={15} />}
              {saving ? 'A guardar...' : saved ? 'Guardado!' : 'Guardar alterações'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 bg-white border-b border-gray-100 flex-shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 ${
              activeTab === tab.id
                ? 'text-gray-900 border-gray-900 bg-gray-50'
                : 'text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'textos' && Object.keys(changes).length > 0 && (
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
            )}
            {tab.id === 'codigo' && (cssChanged || jsChanged) && (
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Conteúdo das tabs */}
      <div className="flex-1 overflow-auto bg-gray-50">

        {/* ── TEXTOS ── */}
        {activeTab === 'textos' && (
          <div className="flex h-full">
            {/* Sidebar de categorias */}
            <div className="w-52 flex-shrink-0 bg-white border-r border-gray-100 p-4 space-y-1">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">Secções</p>
              {textCategories.map(cat => {
                const Icon = cat.icon;
                return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTextCat(cat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTextCat === cat.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={15} />
                  {cat.label}
                </button>
                );
              })}
            </div>

            {/* Campos de texto */}
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 size={24} className="animate-spin text-gray-400" />
                </div>
              ) : textConfigs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                  <AlertCircle size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium text-sm">Nenhum texto configurável nesta secção</p>
                  <p className="text-gray-400 text-xs mt-1">Adiciona entradas na tabela <code className="bg-gray-100 px-1 rounded">site_config</code> com category = <code className="bg-gray-100 px-1 rounded">{activeTextCat}</code></p>
                </div>
              ) : textConfigs.map(config => (
                <div key={config.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="mb-2">
                    <label className="text-sm font-semibold text-gray-900">{config.label}</label>
                    {config.description && <p className="text-xs text-gray-400 mt-0.5">{config.description}</p>}
                    <code className="text-[10px] text-gray-300 font-mono">{config.key}</code>
                  </div>
                  {config.type === 'textarea' ? (
                    <textarea
                      value={getValue(config.key)}
                      onChange={e => handleChange(config.key, e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all resize-none font-mono"
                    />
                  ) : (
                    <input
                      type="text"
                      value={getValue(config.key)}
                      onChange={e => handleChange(config.key, e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CORES ── */}
        {activeTab === 'cores' && (
          <div className="p-6 max-w-2xl space-y-5">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                As cores são guardadas na BD. Para serem aplicadas no site, a landing page precisa de ler os valores de <code className="bg-amber-100 px-1 rounded">site_config</code> em tempo de renderização.
              </p>
            </div>
            {colorConfigs.map(col => {
              const val = getValue(col.key) || '#000000';
              return (
                <div key={col.key} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-5">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-14 h-14 rounded-xl border-2 border-gray-200 cursor-pointer shadow-sm"
                      style={{ backgroundColor: val }}
                    />
                    <input
                      type="color"
                      value={val}
                      onChange={e => handleChange(col.key, e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{col.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{col.desc}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={getValue(col.key)}
                        onChange={e => handleChange(col.key, e.target.value)}
                        className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono w-28 focus:ring-2 focus:ring-gray-900 outline-none"
                        placeholder="#000000"
                      />
                      <button
                        onClick={() => { navigator.clipboard.writeText(val); }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copiar"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── CÓDIGO ── */}
        {activeTab === 'codigo' && (
          <div className="p-6 space-y-6 max-w-4xl">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-start gap-3">
              <Code2 size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800 leading-relaxed">
                <p className="font-semibold mb-1">CSS e JS personalizados</p>
                <p>Os valores são guardados na BD em <code className="bg-blue-100 px-1 rounded">site_config</code>. Para injetar no site, adiciona na <code className="bg-blue-100 px-1 rounded">app/layout.tsx</code>:</p>
                <code className="block mt-2 bg-blue-100 px-2 py-1 rounded font-mono text-[11px] whitespace-pre">
{`const css = await getSiteConfig('custom_css');
const js = await getSiteConfig('custom_js');
// <style dangerouslySetInnerHTML={{ __html: css }} />
// <script dangerouslySetInnerHTML={{ __html: js }} />`}
                </code>
              </div>
            </div>

            {/* CSS Editor */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-sm font-semibold text-gray-700 ml-2">custom.css</span>
                </div>
                {cssChanged && <span className="text-xs text-amber-600 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Não guardado</span>}
              </div>
              <textarea
                value={customCSS}
                onChange={e => { setCustomCSS(e.target.value); setCssChanged(true); }}
                rows={14}
                spellCheck={false}
                placeholder={`/* CSS personalizado — aplicado globalmente no site */\n\n:root {\n  --brand-primary: #e11d48;\n}\n\n.my-custom-class {\n  /* ... */\n}`}
                className="w-full px-5 py-4 bg-gray-950 text-green-400 font-mono text-sm outline-none resize-none leading-relaxed"
              />
            </div>

            {/* JS Editor */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-sm font-semibold text-gray-700 ml-2">custom.js</span>
                </div>
                {jsChanged && <span className="text-xs text-amber-600 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Não guardado</span>}
              </div>
              <textarea
                value={customJS}
                onChange={e => { setCustomJS(e.target.value); setJsChanged(true); }}
                rows={14}
                spellCheck={false}
                placeholder={`// JavaScript personalizado — executado no cliente\n\nconsole.log('MyDay QR site loaded');\n\n// Exemplo: Google Analytics\n// window.dataLayer = window.dataLayer || [];\n// function gtag(){ dataLayer.push(arguments); }\n// gtag('js', new Date());\n// gtag('config', 'GA_MEASUREMENT_ID');`}
                className="w-full px-5 py-4 bg-gray-950 text-yellow-300 font-mono text-sm outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving || (!cssChanged && !jsChanged)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : <Save size={15} />}
                {saved ? 'Guardado!' : 'Guardar código'}
              </button>
            </div>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {activeTab === 'preview' && (
          <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex items-center gap-3 px-6 py-3 bg-white border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    previewDevice === 'desktop' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Monitor size={14} />Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    previewDevice === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Smartphone size={14} />Mobile
                </button>
              </div>
              <button
                onClick={() => setPreviewKey(k => k + 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-600 transition-colors"
              >
                <RefreshCw size={13} />Atualizar
              </button>
              <a
                href="/"
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-600 transition-colors ml-auto"
              >
                <ExternalLink size={13} />Abrir em novo separador
              </a>
            </div>

            {/* Iframe com moldura */}
            <div className="flex-1 overflow-auto bg-gray-300 flex items-center justify-center p-8">

              {/* MOBILE: moldura de telefone */}
              {previewDevice === 'mobile' && (
                <div className="relative flex-shrink-0" style={{ width: 320 }}>
                  {/* outer shell */}
                  <div className="relative bg-gray-900 rounded-[44px] p-3 shadow-2xl" style={{ width: 320 }}>
                    {/* notch */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-950 rounded-b-2xl z-10" />
                    {/* screen */}
                    <div className="relative bg-white rounded-[36px] overflow-hidden" style={{ height: 620 }}>
                      <iframe
                        key={previewKey}
                        ref={iframeRef}
                        src="/"
                        className="w-full h-full border-0"
                        style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: '125%', height: '125%' }}
                      />
                    </div>
                    {/* home bar */}
                    <div className="flex justify-center mt-2">
                      <div className="w-24 h-1 bg-gray-600 rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* DESKTOP: moldura de monitor */}
              {previewDevice === 'desktop' && (
                <div className="w-full max-w-5xl flex-shrink-0">
                  {/* Monitor body */}
                  <div className="bg-gray-800 rounded-t-2xl p-2 shadow-2xl">
                    {/* Chrome bar */}
                    <div className="bg-gray-700 rounded-t-xl px-4 py-2 flex items-center gap-2 mb-0.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <div className="flex-1 bg-gray-600 rounded-lg mx-4 px-3 py-1 text-xs text-gray-300 font-mono">localhost:3000</div>
                    </div>
                    {/* Screen */}
                    <div className="bg-white overflow-hidden" style={{ height: 560 }}>
                      <iframe
                        key={previewKey}
                        ref={iframeRef}
                        src="/"
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                  {/* Stand */}
                  <div className="flex justify-center">
                    <div className="w-32 h-5 bg-gray-700 rounded-b-lg" />
                  </div>
                  <div className="flex justify-center">
                    <div className="w-48 h-3 bg-gray-600 rounded-b-xl" />
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
