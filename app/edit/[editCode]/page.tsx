'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface PublicQrData {
  id: string;
  phrase: string;
  short_code: string;
  created_at: string;
}

export default function PublicEditPage() {
  const params = useParams<{ editCode: string }>();
  const editCode = params?.editCode;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [qrData, setQrData] = useState<PublicQrData | null>(null);
  const [phrase, setPhrase] = useState('');

  useEffect(() => {
    if (!editCode) return;

    const load = async () => {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/qrcodes/public-edit?editCode=${encodeURIComponent(editCode)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Não foi possível abrir este link de edição');
        setLoading(false);
        return;
      }

      setQrData(data);
      setPhrase(data.phrase || '');
      setLoading(false);
    };

    load();
  }, [editCode]);

  const handleSave = async () => {
    if (!editCode || !phrase.trim()) return;

    setSaving(true);
    setError('');
    setSuccess('');

    const res = await fetch('/api/qrcodes/public-edit', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ editCode, phrase: phrase.trim() }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data?.error || 'Não foi possível guardar a frase');
      setSaving(false);
      return;
    }

    setQrData(data.qr);
    setPhrase(data.qr.phrase || phrase.trim());
    setSuccess('Frase atualizada com sucesso!');
    setSaving(false);
  };

  const readUrl = qrData ? `/q/${qrData.short_code}` : '#';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-rose-800 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-5 text-center">
            <h1 className="text-2xl font-bold">Editar mensagem do QR</h1>
            <p className="text-red-100 text-sm mt-1">Sem login, usando o link/cartão de edição</p>
          </div>

          <div className="p-6 md:p-8 text-gray-900">
            {loading ? (
              <div className="py-14 text-center text-gray-500">A carregar...</div>
            ) : error ? (
              <div className="py-4">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Frase atual</label>
                  <textarea
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                    rows={6}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{phrase.length}/500</p>
                </div>

                {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
                {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving || !phrase.trim()}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all"
                  >
                    {saving ? 'A guardar...' : 'Guardar frase'}
                  </button>
                  <a
                    href={readUrl}
                    target="_blank"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-center"
                  >
                    Ver QR público
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
