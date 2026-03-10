import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyDay QR — A Tua Cápsula de Memória Digital",
  description: "Guarda os momentos mais especiais da tua vida num QR code eterno. Casamentos, aniversários, bebé, viagens — um presente que nunca esquece.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          {children}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
