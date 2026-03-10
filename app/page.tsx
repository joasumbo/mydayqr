'use client';

import Link from 'next/link';
import { Heart, Gift, Calendar, Sparkles, QrCode, ShoppingBag, Shield, Zap, Award, Star, ChevronRight, Camera, Users, Plane, Cake, GraduationCap, PartyPopper, Mail, Phone, Baby } from 'lucide-react';
import Footer from '@/components/Footer';

const testimonials = [
  {
    name: 'Ana Rodrigues',
    role: 'Casamento, Junho 2025',
    stars: 5,
    text: 'Criámos um QR para o nosso casamento e todos os convidados adoraram. Ainda hoje adicionamos fotos e memórias. É realmente eterno!',
  },
  {
    name: 'Miguel Santos',
    role: 'Aniversário, Outubro 2025',
    stars: 5,
    text: 'Dei ao meu pai como presente de aniversário. Ele ficou em lágrimas quando abriu o QR e viu todas as mensagens da família. Incrível.',
  },
  {
    name: 'Sofia Martins',
    role: 'Bebé, Dezembro 2025',
    stars: 5,
    text: 'Para o primeiro ano da minha filha, criámos uma cápsula com todos os momentos. A família do estrangeiro pode ver e contribuir. Nunca mais existiu.',
  },
];

const pricingPlans = [
  {
    name: 'Básico',
    price: '€1',
    period: '',
    description: 'Para experimentar',
    features: [
      '1 QR Code',
      '5 fotos',
      '1 ano de armazenamento',
      'Partilha digital',
    ],
    cta: 'Começar',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Avançado',
    price: '€9,99',
    period: '/único',
    description: 'O mais popular',
    features: [
      '10 QR Codes',
      'Fotos e vídeos ilimitados',
      'Armazenamento vitalício',
      'Modo colaborativo',
      'Estatísticas de visitas',
      'Todos os temas',
    ],
    cta: 'Escolher Avançado',
    highlighted: true,
    badge: 'Mais popular',
  },
  {
    name: 'PRO / Família',
    price: '€29',
    period: '/único',
    description: 'Para famílias e eventos',
    features: [
      'QR Codes ilimitados',
      'QR físico incluído',
      'Música/áudio de fundo',
      'Temas personalizados',
      'Suporte prioritário',
      'Domínio personalizado',
    ],
    cta: 'Escolher PRO',
    highlighted: false,
    badge: null,
  },
];

const trustItems = [
  { icon: Shield, label: 'Pagamento Seguro' },
  { icon: Zap, label: 'Entrega Imediata' },
  { icon: Award, label: '100% Satisfação' },
  { icon: QrCode, label: 'QR Eterno' },
];

const useCases = [
  { icon: Heart, label: 'Casamentos' },
  { icon: Baby, label: 'Bebé' },
  { icon: Plane, label: 'Viagens' },
  { icon: Cake, label: 'Aniversários' },
  { icon: GraduationCap, label: 'Formatura' },
  { icon: Gift, label: 'Surpresas' },
  { icon: Users, label: 'Família' },
  { icon: PartyPopper, label: 'Festas' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden text-white" style={{ background: 'radial-gradient(ellipse at center, #dc2626 0%, #991b1b 40%, #450a0a 80%, #1c0505 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)' }} />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Sparkles size={14} />
              <span>A cápsula de memória digital mais especial do mundo</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Transforma os teus momentos<br />
              <span className="text-red-300">numa memória eterna</span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 leading-relaxed opacity-95 max-w-3xl mx-auto">
              Um QR code que guarda fotos, vídeos, mensagens e localizações — para casamentos, aniversários, bebés e muito mais. Para sempre.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/register"
                className="px-10 py-4 bg-white hover:bg-gray-100 text-red-600 font-bold rounded-xl shadow-2xl hover:shadow-xl transition-all transform hover:scale-105 text-lg flex items-center gap-2"
              >
                <QrCode size={20} />
                Criar Conta Grátis
              </Link>
              <Link
                href="/como-funciona"
                className="px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white font-bold rounded-xl border-2 border-white/30 transition-all transform hover:scale-105 text-lg flex items-center gap-2"
              >
                Como Funciona <ChevronRight size={20} />
              </Link>
            </div>

            {/* Demo QR Button */}
            <div className="mt-2">
              <Link
                href="/q/demo"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm underline underline-offset-4 transition-colors"
              >
                <Camera size={15} />
                Experimentar um QR Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-gray-300 text-sm">
                <item.icon size={16} className="text-red-400" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Para cada momento especial</h2>
            <p className="text-gray-600 mb-12 text-lg">Do casamento ao nascimento, da viagem à surpresa — o MyDay QR guarda tudo.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {useCases.map((uc) => (
                <div key={uc.label} className="p-5 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors cursor-pointer text-center group">
                  <div className="flex justify-center mb-3">
                    <uc.icon size={30} className="text-red-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-gray-800 font-semibold text-sm">{uc.label}</span>
                </div>
              ))}
            </div>
            <Link href="/como-funciona" className="inline-flex items-center gap-2 mt-8 text-red-600 font-semibold hover:text-red-700 transition-colors">
              Ver todos os casos de uso <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Como funciona - 3 steps */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Como funciona
            </h2>
            <div className="space-y-8">
              {[
                { n: '1', title: 'Compras e crias o teu QR', desc: 'Escolhes o plano, recebes acesso imediato e personalizas com fotos, vídeos, música e mensagens.' },
                { n: '2', title: 'Colocas o QR num objeto físico', desc: 'O QR imprime-se numa caneca, porta-chave, placa ou autocolante — um presente que fica para sempre.' },
                { n: '3', title: 'Partilhas o momento', desc: 'Qualquer pessoa com o objeto pode escanear e entrar na cápsula, contribuindo com as suas próprias memórias.' },
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-6">
                  <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg">
                    {step.n}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/como-funciona" className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors">
                Saber mais <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Collaborative memory highlight */}
      <div className="py-16 bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="bg-white/15 rounded-2xl p-8 flex-shrink-0">
              <Users size={64} className="text-white mx-auto" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-3">Memória colaborativa</h2>
              <p className="text-white/90 text-lg leading-relaxed">
                Convida amigos e família a contribuir com as suas próprias fotos e mensagens no mesmo QR. Num casamento, todos os convidados adicionam as suas memórias — e ficam guardadas para sempre num só lugar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Para quem é */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Para quem é este presente
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Heart, title: 'Namorados e namoradas', desc: 'Surpreende quem amas com memórias que renovas sempre que quiseres' },
                { icon: Gift, title: 'Casais', desc: 'Um presente único que evolui com a vossa relação' },
                { icon: Calendar, title: 'Datas especiais', desc: 'Aniversários, Natal, Dia dos Namorados... sempre especial' },
                { icon: Sparkles, title: 'Pessoas que valorizam gestos únicos', desc: 'Para quem quer dar algo que nenhum outro presente consegue dar' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-6 bg-red-50 rounded-xl">
                  <item.icon className="text-red-600 flex-shrink-0" size={32} />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              O que dizem os nossos clientes
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Exemplos reais */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Exemplos reais
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { src: '/imagens/caneca.jpeg', alt: 'Caneca com QR Code', title: 'Caneca com frase diária', desc: 'Café da manhã com uma mensagem sempre nova' },
                { src: '/imagens/autocolante.jpeg', alt: 'Autocolante com QR Code', title: 'Autocolante para colocar num objeto', desc: 'No portátil, agenda ou espelho' },
                { src: '/imagens/quadro.jpeg', alt: 'Quadro com QR Code', title: 'Peça na mesa de cabeceira', desc: 'A última coisa que vês antes de dormir' },
                { src: '/imagens/tshirt.jpeg', alt: 'T-shirt com QR Code', title: 'T-shirt com mensagem sempre nova', desc: 'Uma t-shirt que nunca enjoa' },
              ].map((item) => (
                <div key={item.title} className="text-center group">
                  <div className="bg-gray-50 rounded-xl overflow-hidden mb-4 h-56 flex items-center justify-center relative">
                    <img src={item.src} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              Planos e Preços
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Escolhe o plano certo para ti. Sem mensalidades — pagas uma vez, tens para sempre.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-8 flex flex-col ${plan.highlighted
                      ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-2xl scale-105'
                      : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                    }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full">
                      {plan.badge}
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className={`font-bold text-xl mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                    <p className={`text-sm mb-4 ${plan.highlighted ? 'text-red-200' : 'text-gray-500'}`}>{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-red-600'}`}>{plan.price}</span>
                      <span className={`text-sm ${plan.highlighted ? 'text-red-200' : 'text-gray-500'}`}>{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlighted ? 'text-red-100' : 'text-gray-600'}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${plan.highlighted ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`block text-center py-3 rounded-xl font-bold transition-all ${plan.highlighted
                        ? 'bg-white text-red-600 hover:bg-gray-100'
                        : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 bg-gradient-to-br from-red-600 to-red-800 text-white text-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <QrCode size={32} />
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cria a tua cápsula de memória hoje
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Começa grátis. Sem cartão de crédito. Sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-10 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 text-lg shadow-xl"
            >
              Criar Conta Grátis
            </Link>
            <Link
              href="/presentes"
              className="px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white font-bold rounded-xl border-2 border-white/30 transition-all transform hover:scale-105 text-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Ver Presentes
            </Link>
          </div>

          {/* Quick contact */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10 pt-8 border-t border-white/20">
            <a href="mailto:geral.inpulse@gmail.com" className="flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
              <Mail size={16} /> geral.inpulse@gmail.com
            </a>
            <a href="tel:960101116" className="flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
              <Phone size={16} /> 960 101 116
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
