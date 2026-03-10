export const metadata = {
    title: 'Política de Cookies — MyDay QR',
    description: 'Saiba como o MyDay QR utiliza cookies e como pode gerir as suas preferências.',
};

const cookieTypes = [
    {
        name: 'Cookies Essenciais',
        required: true,
        description: 'Necessários para o funcionamento básico do site. Não podem ser desativados.',
        examples: ['Sessão de login', 'Preferências de cookies', 'Segurança'],
    },
    {
        name: 'Cookies de Desempenho',
        required: false,
        description: 'Ajudam-nos a perceber como os visitantes usam o site, através de informações anónimas.',
        examples: ['Google Analytics', 'Métricas de página', 'Erros de carregamento'],
    },
    {
        name: 'Cookies de Funcionalidade',
        required: false,
        description: 'Permitem que o site recorde as tuas escolhas para melhorar a experiência.',
        examples: ['Idioma preferido', 'Região', 'Última visita'],
    },
    {
        name: 'Cookies de Marketing',
        required: false,
        description: 'Usados para mostrar anúncios relevantes com base nos teus interesses.',
        examples: ['Meta Pixel', 'Google Ads', 'Remarketing'],
    },
];

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-2">Política de Cookies</h1>
                    <p className="text-white/80 text-sm">Última atualização: Março de 2026</p>
                </div>
            </div>

            <div className="py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="space-y-8 text-gray-700">

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">O que são cookies?</h2>
                            <p className="leading-relaxed">
                                Cookies são pequenos ficheiros de texto guardados no teu dispositivo quando visitas um site. Permitem que o site recorde as tuas preferências e melhore a tua experiência nas visitas seguintes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Que cookies usamos?</h2>
                            <div className="space-y-4">
                                {cookieTypes.map((ct) => (
                                    <div key={ct.name} className="border border-gray-200 rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg text-gray-900">{ct.name}</h3>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${ct.required ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-600'}`}>
                                                {ct.required ? 'Sempre Ativo' : 'Opcional'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{ct.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {ct.examples.map((ex) => (
                                                <span key={ex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{ex}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Como gerir os cookies?</h2>
                            <p className="leading-relaxed mb-4">
                                Podes gerir as tuas preferências de cookies através do banner que aparece na tua primeira visita ao site. Podes também desativar cookies diretamente no teu browser:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-sm">
                                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Google Chrome</a></li>
                                <li><a href="https://support.mozilla.org/pt-PT/kb/ativar-desativar-cookies" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Mozilla Firefox</a></li>
                                <li><a href="https://support.apple.com/pt-pt/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Apple Safari</a></li>
                                <li><a href="https://support.microsoft.com/pt-pt/windows/eliminar-e-gerir-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Microsoft Edge</a></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Contacto</h2>
                            <p className="leading-relaxed">
                                Para questões sobre a nossa política de cookies ou para exercer os teus direitos, contacta-nos em{' '}
                                <a href="mailto:geral.inpulse@gmail.com" className="text-red-600 hover:underline">geral.inpulse@gmail.com</a>.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
