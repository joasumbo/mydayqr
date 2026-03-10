export const metadata = {
    title: 'Termos e Condições — MyDay QR',
    description: 'Termos e Condições de utilização do MyDay QR.',
};

export default function TermosPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-2">Termos e Condições</h1>
                    <p className="text-white/80 text-sm">Última atualização: Março de 2026</p>
                </div>
            </div>

            <div className="py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="prose prose-lg text-gray-700 space-y-8">

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Identificação da Empresa</h2>
                            <p>
                                O MyDay QR é um serviço operado pela <strong>Inpulse Events</strong>.<br />
                                Morada: Rua do Campo de Futebol, n.º 235 C, 3240-131 Ansião, Portugal.<br />
                                NIF: 516717197 | Email: geral.inpulse@gmail.com | Telefone: 960 101 116.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Objeto do Serviço</h2>
                            <p>
                                O MyDay QR é uma plataforma digital que permite aos utilizadores criar, editar e partilhar cápsulas de memória digital através de QR codes. O serviço inclui alojamento de conteúdos (fotos, vídeos, textos, localizações) associados a um QR code único.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Métodos de Pagamento</h2>
                            <p>
                                Aceitamos pagamento através de cartão de crédito/débito (Visa, Mastercard) e outros métodos disponíveis na plataforma. Todos os pagamentos são processados de forma segura e encriptada. O débito é efetuado no momento da compra.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Prazos de Entrega</h2>
                            <p>
                                Para produtos digitais (QR codes, designs), o acesso é imediato após confirmação do pagamento. Para produtos físicos (placas, porta-chaves, cartões metálicos), o prazo de entrega é de 5 a 10 dias úteis para Portugal continental, salvo indicação contrária no momento da compra.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Política de Devoluções e Reembolsos</h2>
                            <p>
                                De acordo com a legislação portuguesa, tens direito a cancelar a compra e obter reembolso total no prazo de 14 dias após a compra, sem necessidade de justificação. Para produtos físicos já produzidos e enviados, o reembolso será analisado caso a caso. Para exercer este direito, contacta-nos em geral.inpulse@gmail.com.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Garantias</h2>
                            <p>
                                O serviço é prestado com o máximo cuidado. Garantimos a disponibilidade do serviço de acordo com o plano contratado. Em caso de falha técnica imputável à nossa plataforma, procederemos à correção ou reembolso proporcional.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Conteúdos do Utilizador</h2>
                            <p>
                                O utilizador é o único responsável pelos conteúdos que carrega na plataforma. É proibido carregar conteúdos ilegais, ofensivos, que violem direitos de terceiros ou a privacidade de outras pessoas. Reservamo-nos o direito de remover conteúdos que violem estas condições.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Alterações aos Termos</h2>
                            <p>
                                Podemos atualizar estes termos a qualquer momento. Serás notificado por email sobre alterações significativas. O uso contínuo do serviço após a notificação implica a aceitação dos novos termos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Legislação Aplicável</h2>
                            <p>
                                Estes termos são regidos pela legislação portuguesa. Para resolução de conflitos, é competente o tribunal da comarca de Lisboa, sem prejuízo do direito do consumidor recorrer a meios alternativos de resolução de litígios.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Livro de Reclamações</h2>
                            <p>
                                Nos termos da lei, disponibilizamos o Livro de Reclamações Eletrónico em{' '}
                                <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                                    www.livroreclamacoes.pt
                                </a>.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
