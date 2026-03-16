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
  const [menuAberto, setMenuAberto] = useState(false);
  const [statusAssinatura, setStatusAssinatura] = useState<string | null>(null);
  const [dataVencimento, setDataVencimento] = useState<string | null>(null);
  const { usuario, setUsuario, logout } = useAuthStore();

  const fecharMenu = () => setMenuAberto(false);

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
    api.get("/assinatura/status").then((res) => {
      setStatusAssinatura(res.data.statusAssinatura ?? null);
      setDataVencimento(res.data.dataVencimento ?? null);
    }).catch(() => {});
  }, [router, usuario, setUsuario]);

  useEffect(() => {
    if (!montado || pathname === "/dashboard/assinatura") return;
    const token = localStorage.getItem("barbersaas_token");
    if (!token) return;
    const verificarAssinatura = async () => {
      try {
        const res = await api.get("/assinatura/status");
        setStatusAssinatura(res.data.statusAssinatura ?? null);
        setDataVencimento(res.data.dataVencimento ?? null);
        if (res.data.podeAcessarPainel === false) {
          router.replace("/dashboard/assinatura");
        }
      } catch {
      }
    };
    verificarAssinatura();
  }, [montado, pathname, router]);

  const diasRestantesTrial = dataVencimento && statusAssinatura === "TRIAL"
    ? Math.max(0, Math.ceil((new Date(dataVencimento).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;
  const mostrarBannerTrial = statusAssinatura === "TRIAL" && pathname !== "/dashboard/assinatura" && diasRestantesTrial > 0;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  if (!montado) return null;

  const nomeExibicao = usuario?.nome ?? "Carregando...";
  const logoExibicao = usuario?.logoUrl;

  const ConteudoSidebar = () => (
    <>
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
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase inline-block mt-0.5 ${
              usuario?.statusAssinatura === "ATIVO"
                ? "bg-blue-100 text-blue-700"
                : usuario?.statusAssinatura === "TRIAL"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-200 text-gray-600"
            }`}>
              {usuario?.statusAssinatura === "ATIVO"
                ? "PRO"
                : usuario?.statusAssinatura === "TRIAL"
                  ? "TESTE"
                  : "FREE"}
            </span>
          </div>
        </div>

        <nav className="space-y-2 text-sm font-medium">
          <button
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition ${
              isActive("/dashboard") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
            }`}
            onClick={() => { router.push("/dashboard"); fecharMenu(); }}
          >
            <span>Dashboard</span>
            {isActive("/dashboard") && <span className="w-2 h-2 rounded-full bg-red-500" />}
          </button>

          <Link
            href="/dashboard/agendamentos"
            onClick={fecharMenu}
            className={`block px-4 py-3 rounded-lg transition ${
              isActive("/dashboard/agendamentos") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
            }`}
          >
            Agendamentos
          </Link>

          <Link
            href="/dashboard/clientes"
            onClick={fecharMenu}
            className={`block px-4 py-3 rounded-lg transition ${
              isActive("/dashboard/clientes") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
            }`}
          >
            Clientes
          </Link>

          <Link
            href="/dashboard/servicos"
            onClick={fecharMenu}
            className={`block px-4 py-3 rounded-lg transition ${
              isActive("/dashboard/servicos") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
            }`}
          >
            Serviços
          </Link>

          <Link
            href="/dashboard/financeiro"
            onClick={fecharMenu}
            className={`block px-4 py-3 rounded-lg transition ${
              isActive("/dashboard/financeiro") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
            }`}
          >
            Financeiro
          </Link>

          <Link
            href="/dashboard/configuracoes"
            onClick={fecharMenu}
            className={`block px-4 py-3 rounded-lg transition ${
              isActive("/dashboard/configuracoes") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
            }`}
          >
            Configurações
          </Link>

          <Link
            href="/dashboard/assinatura"
            onClick={fecharMenu}
            className={`block px-4 py-3 rounded-lg transition ${
              isActive("/dashboard/assinatura") ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700/60"
            }`}
          >
            Meu Plano
          </Link>
        </nav>
      </div>

      <button
        onClick={() => { handleLogout(); fecharMenu(); }}
        className="flex items-center gap-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/60 px-4 py-3 rounded-lg transition mt-auto"
      >
        <span>Sair do Sistema</span>
      </button>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f7f2ee] font-sans">
      <header className="md:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#1f2933] text-white shadow-lg">
        <button
          type="button"
          onClick={() => setMenuAberto(true)}
          className="p-2 rounded-lg hover:bg-gray-700/60 transition"
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <p className="font-semibold truncate max-w-[180px]">{nomeExibicao}</p>
        <div className="w-10" />
      </header>

      {menuAberto && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={fecharMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          w-72 bg-[#1f2933] text-white flex flex-col justify-between py-8 px-6 rounded-r-3xl shadow-xl
          fixed md:relative inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-out
          md:transform-none
          ${menuAberto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <ConteudoSidebar />
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0 flex flex-col">
        {mostrarBannerTrial && (
          <div className="mb-4 py-3 px-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium flex items-center gap-2">
            <span aria-hidden>🎁</span>
            Você está no Período de Teste Grátis. Aproveite todas as funções por mais {diasRestantesTrial} {diasRestantesTrial === 1 ? "dia" : "dias"}!
          </div>
        )}
        <div className="bg-white rounded-2xl md:rounded-[32px] shadow-lg min-h-full p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}