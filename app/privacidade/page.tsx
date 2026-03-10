export const metadata = {
    title: 'Política de Privacidade — MyDay QR',
    description: 'Saiba como o MyDay QR recolhe, usa e protege os seus dados pessoais.',
};

export default function PrivacidadePage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-2">Política de Privacidade</h1>
                    <p className="text-white/80 text-sm">Última atualização: Março de 2026 | Em conformidade com o RGPD</p>
                </div>
            </div>

            <div className="py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="prose prose-lg text-gray-700 space-y-8">

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Responsável pelo Tratamento de Dados</h2>
                            <p>
                                <strong>Inpulse Events</strong><br />
                                Rua do Campo de Futebol, n.º 235 C, 3240-131 Ansião, Portugal<br />
                                NIF: 516717197<br />
                                Email: geral.inpulse@gmail.com<br />
                                Telefone: 960 101 116
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Dados Recolhidos</h2>
                            <p>Recolhemos os seguintes dados pessoais:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li><strong>Dados de conta:</strong> nome, endereço de email, palavra-passe (encriptada)</li>
                                <li><strong>Dados de pagamento:</strong> processados por terceiros certificados; não armazenamos dados de cartão</li>
                                <li><strong>Conteúdos carregados:</strong> fotos, vídeos, textos, localizações que escolhes partilhar</li>
                                <li><strong>Dados de utilização:</strong> páginas visitadas, funcionalidades usadas, endereço IP</li>
                                <li><strong>Cookies:</strong> conforme descrito na nossa Política de Cookies</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Finalidade e Base Legal</h2>
                            <ul className="list-disc pl-6 space-y-1">
                                <li><strong>Prestação do serviço:</strong> execução do contrato (Art. 6.º, n.º 1, al. b) RGPD)</li>
                                <li><strong>Comunicações de serviço:</strong> interesse legítimo (Art. 6.º, n.º 1, al. f) RGPD)</li>
                                <li><strong>Marketing (newsletters):</strong> consentimento (Art. 6.º, n.º 1, al. a) RGPD) — podes cancelar a qualquer momento</li>
                                <li><strong>Obrigações legais:</strong> cumprimento legal (Art. 6.º, n.º 1, al. c) RGPD)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Retenção de Dados</h2>
                            <p>
                                Os dados de conta são mantidos enquanto a conta estiver ativa. Após o cancelamento da conta, os dados são eliminados no prazo de 30 dias, salvo obrigação legal de retenção. Os conteúdos carregados são eliminados de acordo com o plano contratado.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Partilha de Dados</h2>
                            <p>
                                Não vendemos os teus dados. Partilhamos dados apenas com prestadores de serviços essenciais (alojamento, pagamentos) que estão contratualmente obrigados a proteger os teus dados conforme o RGPD.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Os Teus Direitos</h2>
                            <p>Tens o direito de:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li><strong>Acesso:</strong> saber quais dados temos sobre ti</li>
                                <li><strong>Retificação:</strong> corrigir dados incorretos</li>
                                <li><strong>Apagamento:</strong> solicitar a eliminação dos teus dados</li>
                                <li><strong>Portabilidade:</strong> receber os teus dados num formato estruturado</li>
                                <li><strong>Oposição:</strong> opor-te ao tratamento baseado em interesse legítimo</li>
                                <li><strong>Limitação:</strong> restringir o tratamento em determinadas circunstâncias</li>
                            </ul>
                            <p className="mt-3">
                                Para exercer qualquer destes direitos, contacta-nos em <a href="mailto:geral.inpulse@gmail.com" className="text-red-600 hover:underline">geral.inpulse@gmail.com</a>.
                                Podes também apresentar reclamação à <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">CNPD</a> (Comissão Nacional de Proteção de Dados).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Segurança</h2>
                            <p>
                                Adotamos medidas técnicas e organizativas adequadas para proteger os teus dados contra acesso não autorizado, perda ou destruição, incluindo encriptação de dados em trânsito e em repouso.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
