import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "BarberSaaS Studio | Agenda e gestão para beleza e barbearias",
  description: "Organize agendamentos, clientes, serviços e a rotina do seu espaço com uma plataforma simples e intuitiva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${jakarta.variable} font-sans antialiased text-[var(--ink)] bg-[var(--canvas)]`}
      >
        {children}
      </body>
    </html>
  );
}
