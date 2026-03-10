'use client';

import Link from 'next/link';
import { useState } from 'react';
import { QrCode, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { href: '/', label: 'Início' },
        { href: '/como-funciona', label: 'Como Funciona' },
        { href: '/sobre-nos', label: 'Sobre Nós' },
        { href: '/faq', label: 'FAQ' },
    ];

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-red-600 font-bold text-xl">
                        <QrCode size={28} />
                        <span>MyDay QR</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-600 hover:text-red-600 font-medium transition-colors text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-gray-600 hover:text-red-600 font-medium text-sm transition-colors"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/register"
                            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all transform hover:scale-105 shadow-md"
                        >
                            Criar Conta
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-gray-600 hover:text-red-600"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 pt-2 border-t border-gray-100">
                        <div className="flex flex-col gap-2">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="py-2 px-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-100">
                                <Link href="/login" className="py-2 px-2 text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
                                    Entrar
                                </Link>
                                <Link
                                    href="/register"
                                    className="py-2 px-4 bg-red-600 text-white font-bold rounded-xl text-center"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Criar Conta Grátis
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
