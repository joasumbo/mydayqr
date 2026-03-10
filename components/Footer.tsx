import Link from 'next/link';
import { QrCode, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 text-red-400 font-bold text-xl mb-3">
                            <QrCode size={24} />
                            <span>MyDay QR</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A cápsula de memória digital que guarda os momentos mais especiais da tua vida.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">Navegação</h4>
                        <ul className="space-y-2 text-sm">
                            {[
                                { href: '/', label: 'Início' },
                                { href: '/como-funciona', label: 'Como Funciona' },
                                { href: '/sobre-nos', label: 'Sobre Nós' },
                                { href: '/faq', label: 'FAQ' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-red-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            {[
                                { href: '/termos', label: 'Termos e Condições' },
                                { href: '/privacidade', label: 'Política de Privacidade' },
                                { href: '/cookies', label: 'Política de Cookies' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-red-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <a
                                    href="https://www.livroreclamacoes.pt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
                                >
                                    Livro de Reclamações <ExternalLink size={12} />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contacts */}
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">Contacto</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="mailto:geral.inpulse@gmail.com" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2">
                                    <Mail size={14} />
                                    geral.inpulse@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:960101116" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2">
                                    <Phone size={14} />
                                    960 101 116
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                        <div>
                            <p className="font-medium text-gray-400">Inpulse Events</p>
                            <p>NIF: 516717197 · Rua do Campo de Futebol, n.º 235 C, 3240-131 Ansião, Portugal</p>
                        </div>
                        <p>© {new Date().getFullYear()} MyDay QR — Inpulse Events. Todos os direitos reservados.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
