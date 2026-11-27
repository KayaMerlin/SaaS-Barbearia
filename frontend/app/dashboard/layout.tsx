"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

type DashboardLayoutProps = { children: ReactNode };
type IconName = "inicio" | "agenda" | "clientes" | "servicos" | "financeiro" | "configuracoes" | "plano" | "admin" | "sair";
const icones: Record<IconName, string> = {
  inicio: "M3 10.5 12 3l9 7.5M5 9v12h14V9M9 21v-7h6v7",
  agenda: "M8 3v4m8-4v4M4 10h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  clientes: "M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-7.87a4 4 0 0 1 0 7.75",
  servicos: "M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3Z",
  financeiro: "M3 3v18h18M7 15l4-4 3 2 5-6",
  configuracoes: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-12v2m0 13v2m8.5-8.5h-2m-13 0h-2m14.5-6.5-1.4 1.4M7.9 16.1l-1.4 1.4m11 0-1.4-1.4M7.9 7.9 6.5 6.5",
  plano: "M4 5h16v14H4zM4 10h16M8 15h4",
  admin: "M12 3l9 4v5c0 5-3 8-9 9-6-1-9-4-9-9V7l9-4Zm-4 9 2.5 2.5L16 9",
  sair: "M10 17l5-5-5-5m5 5H3m9-9h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7",
};
function MenuIcon({ name }: { name: IconName }) {
  return <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icones[name]}/></svg>;
}

const navegacao: { href: string; texto: string; icone: IconName }[] = [
  { href: "/dashboard", texto: "Visão geral", icone: "inicio" },
  { href: "/dashboard/agendamentos", texto: "Agendamentos", icone: "agenda" },
  { href: "/dashboard/clientes", texto: "Clientes", icone: "clientes" },
  { href: "/dashboard/servicos", texto: "Serviços", icone: "servicos" },
  { href: "/dashboard/financeiro", texto: "Financeiro", icone: "financeiro" },
];
const configuracoes: { href: string; texto: string; icone: IconName }[] = [
  { href: "/dashboard/configuracoes", texto: "Configurações", icone: "configuracoes" },
  { href: "/dashboard/assinatura", texto: "Meu plano", icone: "plano" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [montado, setMontado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [statusAssinatura, setStatusAssinatura] = useState<string | null>(null);
  const [dataVencimento, setDataVencimento] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { usuario, setUsuario, logout } = useAuthStore();

  useEffect(() => {
    setMontado(true);
    try {
      const u = localStorage.getItem("barbersaas_usuario");
      setIsAdmin(u ? JSON.parse(u).role === "ADMIN" : false);
    } catch { setIsAdmin(false); }
    const token = localStorage.getItem("barbersaas_token");
    if (!token) { router.replace("/login"); return; }
    if (!usuario) {
      api.get("/configuracoes").then((res) => setUsuario({
        nome: res.data.nome ?? "Meu espaço",
        logoUrl: res.data.logoUrl ?? null,
        statusAssinatura: res.data.statusAssinatura ?? "AGUARDANDO_PAGAMENTO",
      })).catch(() => setUsuario({ nome: "Meu espaço", logoUrl: null, statusAssinatura: "AGUARDANDO_PAGAMENTO" }));
    }
    api.get("/assinatura/status").then((res) => {
      setStatusAssinatura(res.data.statusAssinatura ?? null);
      setDataVencimento(res.data.dataVencimento ?? null);
    }).catch(() => {});
  }, [router, usuario, setUsuario]);

  useEffect(() => {
    if (!montado || pathname === "/dashboard/assinatura") return;
    if (!localStorage.getItem("barbersaas_token")) return;
    const verificarAssinatura = async () => {
      try {
        const res = await api.get("/assinatura/status");
        setStatusAssinatura(res.data.statusAssinatura ?? null);
        setDataVencimento(res.data.dataVencimento ?? null);
        if (res.data.podeAcessarPainel === false) router.replace("/dashboard/assinatura");
      } catch { /* Não alterar navegação por falha de rede. */ }
    };
    void verificarAssinatura();
  }, [montado, pathname, router]);

  const diasRestantesTrial = dataVencimento && statusAssinatura === "TRIAL"
    ? Math.max(0, Math.ceil((new Date(dataVencimento).getTime() - Date.now()) / 86400000))
    : 0;
  const mostrarBannerTrial = statusAssinatura === "TRIAL" && pathname !== "/dashboard/assinatura" && diasRestantesTrial > 0;
  const nomeExibicao = usuario?.nome ?? "Seu espaço";
  const logoExibicao = usuario?.logoUrl;
  const paginaAtual = [...navegacao, ...configuracoes, {href:"/admin",texto:"Admin",icone:"admin" as IconName}]
    .find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")))?.texto ?? "Seu painel";

  const handleLogout = () => { logout(); router.push("/login"); };
  const ativo = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  const MenuLinks = ({ links }: { links: typeof navegacao }) => (
    <div className="space-y-1">{links.map((item) => (
      <Link key={item.href} href={item.href} onClick={() => setMenuAberto(false)} aria-current={ativo(item.href)?"page":undefined} className={"sidebar-link gap-3 " + (ativo(item.href)?"sidebar-link-active":"text-[#c9b9c5]")}>
        <MenuIcon name={item.icone}/><span>{item.texto}</span>{ativo(item.href)&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#bb7a8b]"/>}
      </Link>
    ))}</div>
  );

  if (!montado || !localStorage.getItem("barbersaas_token")) return null;

  return (
    <div className="app-shell flex min-h-screen font-sans">
      {menuAberto && <button type="button" aria-label="Fechar menu" className="fixed inset-0 z-30 bg-[#201622]/60 lg:hidden" onClick={()=>setMenuAberto(false)}/>}
      <aside aria-label="Navegação do painel" className={"app-sidebar fixed inset-y-0 left-0 z-40 flex w-[272px] shrink-0 flex-col overflow-y-auto px-4 py-6 shadow-[12px_0_35px_rgba(40,28,40,.08)] transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 " + (menuAberto?"translate-x-0":"-translate-x-full")}>
        <div className="flex items-center gap-3 px-3">
          <Link href="/dashboard" onClick={()=>setMenuAberto(false)} className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5b4256] text-xl text-[#ecc1c8]">✳</span><span className="text-lg font-extrabold tracking-[-.05em] text-white">barber<span className="text-[#e4b1bd]">saas</span></span></Link>
          <button type="button" onClick={()=>setMenuAberto(false)} className="ml-auto rounded-lg p-2 text-white/70 lg:hidden" aria-label="Fechar menu">✕</button>
        </div>

        <div className="mt-9 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.055] p-3">
          {logoExibicao ? <img src={logoExibicao} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover"/> : <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d1a1ae] text-sm font-extrabold uppercase text-[#422b3b]">{nomeExibicao.slice(0,2)}</div>}
          <div className="min-w-0"><p className="truncate text-sm font-bold text-white" title={nomeExibicao}>{nomeExibicao}</p><span className="mt-1 block text-[11px] text-[#bfaebc]">{statusAssinatura==="ATIVO"?"Plano ativo":statusAssinatura==="TRIAL"?"Período de teste":"Área do estabelecimento"}</span></div>
        </div>

        <nav className="mt-9 flex-1" aria-label="Menu lateral"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.21em] text-[#a993a4]">Operação</p><MenuLinks links={navegacao}/><p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[.21em] text-[#a993a4]">Preferências</p><MenuLinks links={configuracoes}/>
          {isAdmin && <div className="mt-4"><MenuLinks links={[{href:"/admin",texto:"Administração",icone:"admin"}]}/></div>}
        </nav>
        <div className="mt-8 border-t border-white/10 pt-4"><button type="button" onClick={handleLogout} className="sidebar-link w-full gap-3 text-[#c9b9c5] hover:text-white"><MenuIcon name="sair"/> Sair da conta</button><p className="mt-5 px-3 text-[10px] text-[#947e91]">BarberSaaS Studio</p></div>
      </aside>

      <div className="app-main min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-[79px] items-center justify-between gap-3 border-b border-[#eee6e3] bg-[#faf7f4]/95 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex min-w-0 items-center gap-3"><button type="button" onClick={()=>setMenuAberto(true)} aria-label="Abrir menu" aria-expanded={menuAberto} className="rounded-xl border border-[#e9deda] bg-white p-2.5 text-[#543f51] lg:hidden"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#b18090]">Seu espaço de trabalho</p><p className="truncate text-lg font-bold tracking-tight text-[#3a2b37]">{paginaAtual}</p></div></div>
          <div className="flex items-center gap-3"><span className="hidden rounded-full border border-[#ecdfdb] bg-white px-4 py-2 text-xs font-semibold text-[#877984] sm:inline-flex">Tudo em um só lugar</span><span title={nomeExibicao} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#f4e4e7] bg-[#e3bfca] text-xs font-extrabold uppercase text-[#654356]">{nomeExibicao.slice(0,2)}</span></div>
        </header>
        <main className="mx-auto w-full max-w-[1570px] p-4 sm:p-7 lg:p-10">
          {mostrarBannerTrial && <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#f2dfc8] bg-[#fff7e8] px-4 py-3 text-sm font-medium text-[#906735]"><span aria-hidden="true">✦</span><p>Você está no período de teste. Restam {diasRestantesTrial} {diasRestantesTrial===1?"dia":"dias"} para aproveitar a plataforma.</p><Link href="/dashboard/assinatura" className="ml-auto whitespace-nowrap font-bold underline underline-offset-4">Meu plano</Link></div>}
          <div className="app-page min-h-[calc(100vh-175px)] p-4 sm:p-7 lg:p-9">{children}</div>
        </main>
      </div>
    </div>
  );
}
