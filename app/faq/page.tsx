import Link from 'next/link';
import FaqAccordion from '@/components/FaqAccordion';
import { Mail, Phone } from 'lucide-react';

export const metadata = {
    title: 'Perguntas Frequentes — MyDay QR',
    description: 'Encontra respostas às perguntas mais comuns sobre o MyDay QR.',
};

export default function FaqPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Perguntas Frequentes</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        Tens dúvidas? Nós respondemos. Se não encontrares o que procuras, contacta-nos diretamente.
                    </p>
                </div>
            </div>

            {/* FAQ Accordion */}
            <div className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <FaqAccordion />
                    </div>
                </div>
            </div>

            {/* Still questions? */}
            <div className="py-16 bg-gray-50 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Ainda tens dúvidas?</h2>
                    <p className="text-gray-600 mb-6">A nossa equipa responde em menos de 24 horas.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:geral.inpulse@gmail.com"
                            className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Mail size={18} />
                            Enviar Email
                        </a>
                        <a
                            href="tel:960101116"
                            className="px-8 py-3 border-2 border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                        >
                            <Phone size={18} />
                            960 101 116
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
