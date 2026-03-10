import Link from 'next/link';
import { ShoppingCart, QrCode, Share2, Camera, MapPin, Music, Users, Calendar, Heart, Plane, Baby, Sparkles, Gift } from 'lucide-react';

export const metadata = {
    title: 'Como Funciona — MyDay QR',
    description: 'Descobre como o MyDay QR transforma os teus momentos mais especiais numa cápsula de memória digital eterna.',
};

const steps = [
    {
        number: '1',
        icon: ShoppingCart,
        title: 'Escolhe e Compra',
        description: 'Escolhe o plano ideal para ti. Recebes acesso imediato ao teu painel pessoal.',
    },
    {
        number: '2',
        icon: QrCode,
        title: 'Cria o Teu QR',
        description: 'Adiciona fotos, vídeos, mensagens, localização e música. Personaliza com o tema que mais gostas: Casamento, Bebé, Viagem, ou Aniversário.',
    },
    {
        number: '3',
        icon: Share2,
        title: 'Partilha o Momento',
        description: 'Partilha o QR com quem amas. Eles digitalizam e entram na tua cápsula de memória, podendo também contribuir com os seus próprios conteúdos.',
    },
];

const useCases = [
    {
        icon: Heart,
        title: 'Casamentos',
        description: 'Cria uma memória colaborativa do teu grande dia. Convidados adicionam fotos e mensagens — tudo num só lugar, para sempre.',
    },
    {
        icon: Baby,
        title: 'Memórias de Bebé',
        description: 'Regista os primeiros sorrisos, passos e palavras. Uma timeline automática que cresce com o teu filho.',
    },
    {
        icon: Plane,
        title: 'Viagens',
        description: 'Guarda cada destino, cada aventura. Fotos, vídeos e localizações organizados automaticamente por data.',
    },
    {
        icon: Calendar,
        title: 'Aniversários',
        description: 'O presente mais especial que alguém pode receber: um QR com todas as mensagens dos amigos e família, para sempre.',
    },
    {
        icon: Gift,
        title: 'Surpresas',
        description: 'Pedidos de casamento, surpresas de aniversário... um QR revelado no momento certo vale mais do que qualquer presente.',
    },
    {
        icon: Users,
        title: 'Família',
        description: 'Um arquivo familiar colaborativo. Avós, pais e filhos a construir a história da família juntos.',
    },
];

const features = [
    { icon: Camera, label: 'Fotos e vídeos ilimitados' },
    { icon: MapPin, label: 'Localização automática' },
    { icon: Music, label: 'Música de fundo' },
    { icon: Users, label: 'Contribuições colaborativas' },
    { icon: Calendar, label: 'Timeline automática' },
    { icon: QrCode, label: 'QR eterno e editável' },
];

export default function ComoFuncionaPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Como Funciona</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        Em 3 passos simples, transforma os teus momentos mais especiais numa cápsula de memória digital eterna.
                    </p>
                </div>
            </div>

            {/* 3 Steps */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-10">
                            {steps.map((step) => (
                                <div key={step.number} className="flex items-start gap-6 p-8 bg-gray-50 rounded-2xl">
                                    <div className="bg-red-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-lg">
                                        {step.number}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <step.icon className="text-red-600" size={22} />
                                            <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                                        </div>
                                        <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Funcionalidades */}
            <div className="py-16 bg-red-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">O que podes incluir no teu QR</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        {features.map((f) => (
                            <div key={f.label} className="bg-white rounded-xl p-5 shadow-sm flex flex-col items-center gap-3">
                                <f.icon className="text-red-600" size={28} />
                                <span className="text-gray-700 font-medium text-sm">{f.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Casos de uso */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Para cada momento especial</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {useCases.map((uc) => (
                            <div key={uc.title} className="p-6 border border-gray-100 rounded-2xl hover:border-red-200 hover:shadow-md transition-all">
                                <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                    <uc.icon className="text-red-600" size={24} />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-2">{uc.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{uc.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-16 bg-gradient-to-br from-red-600 to-red-800 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-4">Pronto para criar a tua memória?</h2>
                    <p className="text-lg opacity-90 mb-8">Começa hoje. É grátis para experimentar.</p>
                    <Link
                        href="/register"
                        className="inline-block px-10 py-4 bg-white text-red-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                    >
                        Criar Conta Grátis
                    </Link>
                </div>
            </div>
        </div>
    );
}
