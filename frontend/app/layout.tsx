import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "BarberSaaS | Gestão e Pagamentos",
  description: "Plataforma completa para barbearias modernas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${jakarta.variable} font-sans antialiased text-slate-900 bg-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
