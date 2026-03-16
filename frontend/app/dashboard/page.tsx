"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

function gerarSeteDiasZerados(): ResumoSemanaItem[] {
  const hoje = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - 6 + i);
    const diaNum = d.getDate();
    const diaNome = DIAS_SEMANA[d.getDay()];
    return { dia: `${diaNome} ${diaNum}`, cortes: 0, receita: 0, dataISO: d.toISOString().split("T")[0] };
  });
}

export default function DashboardHome() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [dadosGrafico, setDadosGrafico] = useState<ResumoSemanaItem[]>(() => gerarSeteDiasZerados());
  const [carregando, setCarregando] = useState(true);

  const dataHoje = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const usuarioStr = typeof window !== "undefined" ? localStorage.getItem("barbersaas_usuario") : null;
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
    if (usuario?.role === "ADMIN") {
      router.replace("/admin");
      return;
    }
  }, [router]);

  const carregarAgenda = async () => {
    try {
      const [resAgenda, resResumo] = await Promise.all([
        api.get<Agendamento[]>(`/agendamentos?data=${dataHoje}`),
        api.get<ResumoSemanaItem[]>("/agendamentos/resumo-semana"),
      ]);
      setAgendamentos(resAgenda.data ?? []);
      const resumo = Array.isArray(resResumo.data) ? resResumo.data : [];
      setDadosGrafico(resumo.length > 0 ? resumo : gerarSeteDiasZerados());
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const usuarioStr = typeof window !== "undefined" ? localStorage.getItem("barbersaas_usuario") : null;
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
    if (usuario?.role === "ADMIN") return;
    carregarAgenda();
  }, []);

  const atualizarStatus = async (id: string, novoStatus: string) => {
    try {
      await api.patch(`/agendamentos/${id}/status`, { status: novoStatus });
      carregarAgenda();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  const agendamentosValidos = agendamentos.filter(
    (a) => a.status !== "CANCELADO"
  );

  const totalAgendamentos = agendamentosValidos.length;
  const clientesAtendidos = agendamentos.filter(
    (a) => a.status === "CONCLUIDO"
  ).length;

  const receitaEstimada = agendamentosValidos.reduce((total, agendamento) => {
    return total + parseFloat(agendamento.servico.preco);
  }, 0);

  if (carregando)
    return (
      <div className="text-gray-500 font-medium">Carregando seus dados...</div>
    );

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Dashboard
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Resumo da sua barbearia hoje
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Hoje
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Agendamentos do Dia
          </p>
          <p className="text-4xl font-black text-gray-900">
            {totalAgendamentos}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Clientes Atendidos
          </p>
          <p className="text-4xl font-black text-blue-600">
            {clientesAtendidos}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Receita Estimada
          </p>
          <p className="text-4xl font-black text-green-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(receitaEstimada)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Fluxo da semana</h3>
            <span className="text-xs text-gray-400 font-medium">
              Cortes confirmados (últimos 7 dias)
            </span>
          </div>
          <div className="w-full h-[350px] min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosGrafico}>
                <defs>
                  <linearGradient id="colorCortes" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#2563EB"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#2563EB"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="dia"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0].payload as ResumoSemanaItem;
                    return (
                      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100">
                        <p className="font-bold text-gray-900 mb-1">{p.dia}</p>
                        <p className="text-sm text-gray-600">{p.cortes} corte(s)</p>
                        <p className="text-sm font-bold text-green-600">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.receita)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cortes"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCortes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 mb-6">Próximos horários</h3>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {agendamentos.length === 0 ? (
              <p className="text-sm text-gray-400 text-center mt-10">
                Nenhum horário marcado para hoje.
              </p>
            ) : (
              agendamentos.map((agendamento) => {
                const horaFormatada = new Date(
                  agendamento.dataHora
                ).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={agendamento.id}
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">
                          {agendamento.cliente.nome}
                        </p>
                        <p className="text-xs text-gray-500">
                          {agendamento.servico.nome}
                        </p>
                      </div>
                      <span className="bg-white px-2 py-1 rounded text-xs font-black text-gray-800 shadow-sm">
                        {horaFormatada}
                      </span>
                    </div>

                    {(agendamento.status === "PENDENTE" ||
                      agendamento.status === "CONFIRMADO") ? (
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() =>
                            atualizarStatus(agendamento.id, "CONCLUIDO")
                          }
                          className="flex-1 bg-gray-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-black transition"
                        >
                          Concluir
                        </button>
                        <button
                          onClick={() =>
                            atualizarStatus(agendamento.id, "CANCELADO")
                          }
                          className="flex-1 bg-white border border-gray-200 text-red-600 text-xs font-bold py-2 rounded-lg hover:bg-red-50 transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : agendamento.status === "AGUARDANDO_PAGAMENTO" ? (
                      <div className="text-xs font-bold px-3 py-1.5 rounded-md bg-amber-100 text-amber-700 inline-block text-center w-full">
                        Aguard. pagamento
                      </div>
                    ) : (
                      <div
                        className={`text-xs font-bold px-3 py-1.5 rounded-md inline-block text-center w-full ${
                          agendamento.status === "CONCLUIDO"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {agendamento.status === "CONCLUIDO"
                          ? "✓ Finalizado"
                          : "✕ Cancelado"}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


