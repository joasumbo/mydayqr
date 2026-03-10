import Link from 'next/link';
import { Heart, Target, Users } from 'lucide-react';

export const metadata = {
    title: 'Sobre Nós — MyDay QR',
    description: 'Conheça a equipa por trás do MyDay QR e a nossa missão de preservar memórias especiais através da tecnologia.',
};

export default function SobreNosPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre Nós</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        A história por trás do MyDay QR — porque acreditamos que os momentos merecem ser eternos.
                    </p>
                </div>
            </div>

            {/* História */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">A Nossa História</h2>
                        <div className="prose prose-lg text-gray-600 space-y-4">
                            <p>
                                O MyDay QR nasceu de uma ideia simples: e se um simples QR code pudesse guardar para sempre o melhor de um dia especial? Casamentos, nascimentos, viagens, surpresas — momentos que desaparecem demasiado depressa.
                            </p>
                            <p>
                                A <strong className="text-gray-900">Inpulse Events</strong> existe para criar soluções práticas para pessoas reais. O MyDay QR é o nosso produto de coração — criado com a genuína crença de que a tecnologia deve servir as emoções.
                            </p>
                            <p>
                                Hoje, ajudamos centenas de famílias, casais e amigos a guardar os seus momentos mais preciosos numa cápsula digital eterna — acessível com um simples scan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Missão, Visão, Valores */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                            <div className="bg-red-100 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Target size={28} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-3">Missão</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Tornar acessível a todos a capacidade de preservar os seus momentos mais especiais através de tecnologia simples e bonita.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                            <div className="bg-red-100 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Heart size={28} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-3">Visão</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Um mundo onde nenhum momento especial se perde — onde qualquer pessoa pode criar uma cápsula de memória eterna.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                            <div className="bg-red-100 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Users size={28} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-3">Valores</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Simplicidade, emoção e confiança. Construímos cada funcionalidade a pensar nas pessoas e nos momentos que mais importam.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Equipa */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">A Nossa Equipa</h2>
                    <p className="text-gray-600 mb-12 max-w-xl mx-auto">
                        Somos uma pequena equipa apaixonada por tecnologia e por pessoas.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Users size={40} className="text-red-600" />
                            </div>
                            <p className="font-bold text-gray-900">Equipa MyDay QR</p>
                            <p className="text-gray-500 text-sm">Inpulse Events</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-16 bg-red-50 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tens questões?</h2>
                    <p className="text-gray-600 mb-6">Estamos sempre disponíveis para ajudar.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:geral.inpulse@gmail.com"
                            className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all"
                        >
                            Enviar Email
                        </a>
                        <Link
                            href="/faq"
                            className="px-8 py-3 border-2 border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all"
                        >
                            Ver FAQ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
