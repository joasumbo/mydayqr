'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        q: 'O QR expira?',
        a: 'Não! Os QR codes do plano Avançado e PRO têm armazenamento vitalício. O plano Básico inclui 1 ano de armazenamento. Podes renovar ou fazer upgrade a qualquer momento.',
    },
    {
        q: 'Posso editar o conteúdo depois de criar o QR?',
        a: 'Sim, sempre! Um dos maiores benefícios do MyDay QR é exatamente este: podes adicionar conteúdo, editar títulos, apagar fotos ou adicionar novas memórias a qualquer momento, sem precisar de criar um novo QR.',
    },
    {
        q: 'Como recebo o meu QR Code?',
        a: 'Após a compra, recebes acesso imediato ao teu painel pessoal onde podes criar e gerir o teu QR. O código pode ser descarregado em alta qualidade para imprimir num objeto físico, ou partilhado digitalmente.',
    },
    {
        q: 'Outras pessoas podem adicionar conteúdo ao meu QR?',
        a: 'Sim! Nos planos Avançado e PRO podes ativar a funcionalidade colaborativa. Partilhas um link especial e convidados podem adicionar fotos, mensagens e vídeos — ideal para casamentos ou festas de aniversário.',
    },
    {
        q: 'Qual é a diferença entre os planos?',
        a: 'O plano Básico (€1) inclui 1 QR, 5 fotos e 1 ano de armazenamento. O plano Avançado (€9,99—€14,99) inclui 10 QRs, fotos e vídeos ilimitados e armazenamento vitalício. O plano PRO/Família (€29—€49) inclui QRs ilimitados, QR físico incluído e suporte a música.',
    },
    {
        q: 'Que tipos de ficheiros posso adicionar?',
        a: 'Podes adicionar fotos (JPG, PNG), vídeos (MP4), áudio/música, mensagens de texto, localizações e datas. No plano PRO também podes adicionar ficheiros de áudio como música de fundo.',
    },
    {
        q: 'O pagamento é seguro?',
        a: 'Sim. Todos os pagamentos são processados através de plataformas certificadas e encriptadas. Nunca armazenamos os teus dados de cartão.',
    },
    {
        q: 'Posso cancelar ou pedir reembolso?',
        a: 'Tens direito a reembolso total nos primeiros 14 dias após a compra, de acordo com a lei portuguesa. Basta contactar-nos por email.',
    },
    {
        q: 'O QR funciona em qualquer smartphone?',
        a: 'Sim! O QR code funciona em qualquer smartphone com câmara — iOS e Android. Não é necessário instalar nenhuma aplicação.',
    },
];

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <span className="font-semibold text-gray-900">{q}</span>
                <ChevronDown
                    size={20}
                    className={`text-red-600 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {a}
                </div>
            )}
        </div>
    );
}

export default function FaqAccordion() {
    return (
        <div className="space-y-3">
            {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
        </div>
    );
}
