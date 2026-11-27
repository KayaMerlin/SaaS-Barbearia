"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";

type Agendamento = {
  id: string;
  dataHora: string;
  status: string;
  servico: { nome: string; preco: string };
  cliente: { nome: string; telefone: string };
};
type ResumoSemanaItem = { dia: string; cortes: number; receita: number; dataISO: string };
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const dinheiro = (valor: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

function gerarSeteDiasZerados(): ResumoSemanaItem[] {
  const hoje = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - 6 + i);
    return { dia: DIAS_SEMANA[d.getDay()] + " " + d.getDate(), cortes: 0, receita: 0, dataISO: d.toISOString().split("T")[0] };
  });
}

export default function DashboardHome() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [dadosGrafico, setDadosGrafico] = useState<ResumoSemanaItem[]>(gerarSeteDiasZerados);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const dataHoje = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

  const carregarAgenda = useCallback(async () => {
    try {
      setErro("");
      const [resAgenda, resResumo] = await Promise.all([
        api.get<Agendamento[]>("/agendamentos?data=" + dataHoje),
        api.get<ResumoSemanaItem[]>("/agendamentos/resumo-semana"),
      ]);
      setAgendamentos(Array.isArray(resAgenda.data) ? resAgenda.data : []);
      setDadosGrafico(Array.isArray(resResumo.data) && resResumo.data.length > 0 ? resResumo.data : gerarSeteDiasZerados());
    } catch (error) {
      console.error("Erro ao carregar agenda:", error);
      setErro("Não foi possível atualizar o painel. Confira sua conexão e tente novamente.");
    } finally { setCarregando(false); }
  }, [dataHoje]);

  useEffect(() => {
    let user: { role?: string } | null = null;
    try {
      const raw = localStorage.getItem("barbersaas_usuario");
      user = raw ? JSON.parse(raw) : null;
    } catch { user = null; }
    if (user?.role === "ADMIN") { router.replace("/admin"); return; }
    void carregarAgenda();
  }, [carregarAgenda, router]);

  const atualizarStatus = async (id: string, status: string) => {
    setAtualizando(id);
    setErro("");
    try {
      await api.patch("/agendamentos/" + id + "/status", { status });
      await carregarAgenda();
    } catch {
      setErro("Não foi possível atualizar o agendamento. Tente novamente.");
    } finally { setAtualizando(null); }
  };

  const agendamentosValidos = agendamentos.filter(a => a.status !== "CANCELADO");
  const totalAgendamentos = agendamentosValidos.length;
  const clientesAtendidos = agendamentos.filter(a => a.status === "CONCLUIDO").length;
  const pendentes = agendamentos.filter(a => a.status === "PENDENTE" || a.status === "AGUARDANDO_PAGAMENTO").length;
  const receitaEstimada = agendamentosValidos.reduce((s, a) => s + (Number(a.servico?.preco) || 0), 0);
  const agendaOrdenada = [...agendamentos].sort((a,b)=>new Date(a.dataHora).getTime()-new Date(b.dataHora).getTime());

  if (carregando) {
    return <div className="animate-pulse space-y-7" aria-live="polite" aria-label="Carregando painel"><div className="h-12 w-72 rounded-2xl bg-[#f3ebeb]"/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="h-36 rounded-[22px] bg-[#f7eeee]"/>)}</div><div className="grid gap-5 xl:grid-cols-3"><div className="h-80 rounded-[22px] bg-[#f7eeee] xl:col-span-2"/><div className="h-80 rounded-[22px] bg-[#f7eeee]"/></div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="dashboard-eyebrow">Painel do seu espaço</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.055em] text-[#352a35] sm:text-4xl">Sua rotina, num só olhar.</h1><p className="mt-3 text-sm text-[#8c7e88]">Acompanhe seus atendimentos e organize o dia com tranquilidade.</p></div>
        <div className="flex flex-wrap gap-2"><Link href="/dashboard/agendamentos" className="action-primary inline-flex items-center justify-center gap-2 text-sm">Ver agenda <span aria-hidden="true">↗</span></Link><button type="button" onClick={()=>void carregarAgenda()} className="rounded-xl border border-[#e8deda] bg-white px-4 py-3 text-sm font-semibold text-[#645361] transition hover:bg-[#faf5f5]">↻ Atualizar</button></div>
      </div>
      {erro&&<div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{erro}</div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Atendimentos do dia", value: String(totalAgendamentos).padStart(2,"0"), detail: "Agendados para hoje", icon: "◷", special: true },
          { label: "Concluídos", value: String(clientesAtendidos).padStart(2,"0"), detail: "Atendimentos finalizados", icon: "✓" },
          { label: "Aguardando", value: String(pendentes).padStart(2,"0"), detail: "Reservas pendentes", icon: "⌛" },
          { label: "Receita estimada", value: dinheiro(receitaEstimada), detail: "Total previsto nas reservas", icon: "↗" },
        ].map(item=><div key={item.label} className={"rounded-[24px] border p-5 sm:p-6 "+(item.special?"border-[#4b3748] bg-[#3b2e3e] text-white":"border-[#eee5e2] bg-[#fcfaf9] text-[#352936]")}>
          <div className="flex items-center justify-between gap-3"><p className={"text-xs font-bold "+(item.special?"text-[#e2bfcc]":"text-[#a58090]")}>{item.label}</p><span className={"flex h-9 w-9 items-center justify-center rounded-xl text-lg "+(item.special?"bg-white/10 text-[#f2cad2]":"bg-[#f5e7e7] text-[#ac7687]")}>{item.icon}</span></div>
          <p className={"mt-5 break-words text-[clamp(1.9rem,3vw,2.5rem)] font-extrabold tracking-[-.055em] "+(item.special?"text-white":"text-[#382c38]")}>{item.value}</p>
          <p className={"mt-2 text-xs "+(item.special?"text-[#c8b4c4]":"text-[#92838c]")}>{item.detail}</p>
        </div>)}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <section className="dashboard-card min-w-0 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="dashboard-eyebrow">Últimos 7 dias</p><h2 className="mt-2 text-xl font-bold tracking-tight text-[#3a3039]">Movimento da semana</h2></div><span className="rounded-full bg-[#f8eeee] px-3 py-2 text-xs font-semibold text-[#a16e7c]">Atendimentos</span></div>
          <div className="mt-6 h-[285px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosGrafico} margin={{top:8,right:12,left:-20,bottom:0}}>
                <defs><linearGradient id="agendaGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#bb8799" stopOpacity={0.3}/><stop offset="95%" stopColor="#bb8799" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid stroke="#f1e8e9" vertical={false} strokeDasharray="4 4"/>
                <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{fontSize:11,fill:"#a3949b"}} dy={10}/>
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fontSize:11,fill:"#a3949b"}}/>
                <Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;const p=payload[0].payload as ResumoSemanaItem;return <div className="rounded-2xl border border-[#f0e8e6] bg-white px-4 py-3 shadow-xl"><p className="text-xs font-bold text-[#483744]">{p.dia}</p><p className="mt-1 text-xs text-[#907c87]">{p.cortes} atendimento(s)</p><p className="mt-1 text-xs font-bold text-[#ad788a]">{dinheiro(p.receita)}</p></div>;}}/>
                <Area type="monotone" dataKey="cortes" stroke="#ad788a" strokeWidth={3} fill="url(#agendaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="dashboard-card min-w-0 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3"><div><p className="dashboard-eyebrow">Agenda de hoje</p><h2 className="mt-2 text-xl font-bold tracking-tight text-[#3a3039]">Próximos horários</h2></div><Link href="/dashboard/agendamentos" className="text-xs font-bold text-[#ab7586] hover:underline">Ver todos ↗</Link></div>
          <div className="mt-5 max-h-[340px] space-y-3 overflow-y-auto pr-1">
            {agendaOrdenada.length===0?<div className="rounded-2xl border border-dashed border-[#e8dada] bg-[#fdf9f8] px-5 py-12 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5e8e8] text-2xl text-[#b47a8a]">◷</div><h3 className="mt-4 text-sm font-bold text-[#55434f]">Agenda livre por enquanto</h3><p className="mt-2 text-xs leading-6 text-[#9b8a94]">Novos agendamentos aparecerão aqui.</p></div>:agendaOrdenada.map(a=>{
              const hora=new Date(a.dataHora).toLocaleTimeString("pt-BR",{timeZone:"America/Sao_Paulo",hour:"2-digit",minute:"2-digit"});
              const podeAtualizar=a.status==="PENDENTE"||a.status==="CONFIRMADO";
              return <article key={a.id} className="rounded-2xl border border-[#efe7e4] bg-[#fffcfb] p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-[#443340]">{a.cliente?.nome||"Cliente"}</p><p className="mt-1 truncate text-xs text-[#91818a]">{a.servico?.nome||"Serviço"}</p></div><span className="shrink-0 rounded-xl bg-[#f7ebeb] px-3 py-2 text-xs font-extrabold text-[#a96e83]">{hora}</span></div>
                {podeAtualizar?<div className="mt-4 flex gap-2"><button type="button" disabled={atualizando===a.id} onClick={()=>void atualizarStatus(a.id,"CONCLUIDO")} className="flex-1 rounded-xl bg-[#3d303d] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#5d455b] disabled:opacity-50">Concluir</button><button type="button" disabled={atualizando===a.id} onClick={()=>void atualizarStatus(a.id,"CANCELADO")} className="flex-1 rounded-xl border border-[#ecdcd9] bg-white px-3 py-2.5 text-xs font-bold text-[#a46970] transition hover:bg-[#fef4f3] disabled:opacity-50">Cancelar</button></div>:<p className={"mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold "+(a.status==="CONCLUIDO"?"bg-[#eaf6ee] text-[#387854]":a.status==="CANCELADO"?"bg-[#f4f1f1] text-[#8d7d86]":"bg-[#fff2df] text-[#986c35]")}>{a.status==="CONCLUIDO"?"Finalizado":a.status==="CANCELADO"?"Cancelado":"Aguardando pagamento"}</p>}
              </article>;
            })}
          </div>
        </section>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[{href:"/dashboard/clientes",titulo:"Clientes",texto:"Mantenha o relacionamento por perto.",icone:"◎"},{href:"/dashboard/servicos",titulo:"Serviços",texto:"Organize seus atendimentos e valores.",icone:"✳"},{href:"/dashboard/financeiro",titulo:"Financeiro",texto:"Acompanhe os números do espaço.",icone:"↗"}].map(item=><Link key={item.href} href={item.href} className="group flex items-center gap-4 rounded-[22px] border border-[#eee6e3] bg-[#fdf9f8] p-5 transition hover:border-[#d7b9c0] hover:shadow-lg hover:shadow-[#6c465b]/5"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1e2e5] text-xl text-[#ac7889]">{item.icone}</span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-[#40313c]">{item.titulo}</span><span className="mt-1 block text-xs text-[#978892]">{item.texto}</span></span><span className="text-[#b5899a] transition group-hover:translate-x-1" aria-hidden="true">↗</span></Link>)}
      </div>
    </div>
  );
}
