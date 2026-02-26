'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({ value, onChange, folder = 'uploads' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Máximo 5MB.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Erro no upload');
      onChange(json.url);
    } catch (e: any) {
      setError(e.message || 'Erro ao fazer upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative w-full h-36 bg-gray-700 rounded-xl overflow-hidden group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="w-full h-36 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-red-500 hover:bg-gray-700/50 transition-all"
        >
          {uploading ? (
            <Loader2 size={28} className="text-gray-400 animate-spin" />
          ) : (
            <>
              <Upload size={28} className="text-gray-400" />
              <p className="text-sm text-gray-400">Clica ou arrasta a imagem</p>
              <p className="text-xs text-gray-600">PNG, JPG, WEBP — máx. 5MB</p>
            </>
          )}
        </div>
      )}

      {/* Botão trocar quando já tem imagem */}
      {value && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ImageIcon size={13} /> Trocar imagem
        </button>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
