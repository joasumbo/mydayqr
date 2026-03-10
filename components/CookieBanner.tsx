'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem('cookie-consent', 'rejected');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <Cookie className="text-red-400 flex-shrink-0 mt-0.5" size={22} />
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Usamos cookies para melhorar a tua experiência. Ao continuar, aceitas a nossa{' '}
                        <Link href="/cookies" className="text-red-400 hover:text-red-300 underline">
                            Política de Cookies
                        </Link>{' '}
                        e{' '}
                        <Link href="/privacidade" className="text-red-400 hover:text-red-300 underline">
                            Privacidade
                        </Link>
                        .
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={handleReject}
                        className="px-4 py-2 text-sm border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white rounded-lg transition-colors"
                    >
                        Rejeitar
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
                    >
                        Aceitar
                    </button>
                    <button onClick={handleReject} className="text-gray-500 hover:text-gray-300 transition-colors ml-1" aria-label="Fechar">
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
