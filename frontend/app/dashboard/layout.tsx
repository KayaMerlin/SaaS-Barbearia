"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [montado, setMontado] = useState(false);
  const { usuario, setUsuario, logout } = useAuthStore();

  useEffect(() => {
    setMontado(true);
    const token = localStorage.getItem("barbersaas_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!usuario) {
      api
        .get("/configuracoes")
        .then((res) => {
          setUsuario({
            nome: res.data.nome ?? "Minha Barbearia",
            logoUrl: res.data.logoUrl ?? null,
            statusAssinatura: res.data.statusAssinatura ?? "AGUARDANDO_PAGAMENTO",
          });
        })
        .catch(() => {
          setUsuario({
            nome: "Barbearia",
            logoUrl: null,
            statusAssinatura: "AGUARDANDO_PAGAMENTO",
          });
        });
    }
  }, [router, usuario, setUsuario]);

  useEffect(() => {
    if (!montado || pathname === "/dashboard/assinatura") return;
    const token = localStorage.getItem("barbersaas_token");
    if (!token) return;
    const verificarAssinatura = async () => {
      try {
        const res = await api.get("/assinatura/status");
        if (res.data.podeAcessarPainel === false) {
          router.replace("/dashboard/assinatura");
        }
      } catch {
      }
    };
    verificarAssinatura();
  }, [montado, pathname, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  if (!montado) return null;

  const nomeExibicao = usuario?.nome ?? "Carregando...";
  const logoExibicao = usuario?.logoUrl;

  return (
    <div className="min-h-screen flex bg-[#f7f2ee] font-sans">
      <aside className="w-72 bg-[#1f2933] text-white flex flex-col justify-between py-8 px-6 rounded-r-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold overflow-hidden flex-shrink-0 border-2 border-slate-600">
              {logoExibicao ? (
                <img
                  src={logoExibicao}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm uppercase text-slate-300">
                  {nomeExibicao.substring(0, 2)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p
                className="font-semibold text-white truncate max-w-[150px]"
                title={nomeExibicao}
              >
                {nomeExibicao}
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase inline-block mt-0.5">
                {usuario?.statusAssinatura === "ATIVO" ? "PRO" : "FREE"}
              </span>
            </div>
          </div>

          <nav className="space-y-2 text-sm font-medium">
            <button
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition ${
                isActive("/dashboard") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
              }`}
              onClick={() => router.push("/dashboard")}
            >
              <span>Dashboard</span>
              {isActive("/dashboard") && <span className="w-2 h-2 rounded-full bg-red-500" />}
            </button>

            <Link
              href="/dashboard/agendamentos"
              className={`block px-4 py-3 rounded-lg transition ${
                isActive("/dashboard/agendamentos") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
              }`}
            >
              Agendamentos
            </Link>

            <Link
              href="/dashboard/clientes"
              className={`block px-4 py-3 rounded-lg transition ${
                isActive("/dashboard/clientes") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
              }`}
            >
              Clientes
            </Link>

            <Link
              href="/dashboard/servicos"
              className={`block px-4 py-3 rounded-lg transition ${
                isActive("/dashboard/servicos") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
              }`}
            >
              Serviços
            </Link>

            <Link
              href="/dashboard/financeiro"
              className={`block px-4 py-3 rounded-lg transition ${
                isActive("/dashboard/financeiro") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
              }`}
            >
              Financeiro
            </Link>

            <Link
              href="/dashboard/configuracoes"
              className={`block px-4 py-3 rounded-lg transition ${
                isActive("/dashboard/configuracoes") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
              }`}
            >
              Configurações
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/60 px-4 py-3 rounded-lg transition mt-auto"
        >
          <span>Sair do Sistema</span>
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-[32px] shadow-lg min-h-full p-8">
          {children}
        </div>
      </main>
    </div>
  );
}