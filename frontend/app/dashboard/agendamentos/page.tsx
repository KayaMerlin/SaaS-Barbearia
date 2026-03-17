"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Agendamento = {
  id: string;
  dataHora: string;
  status: string;
  servico: { nome: string; preco: string; duracao?: number };
  cliente: { nome: string; telefone: string };
  transacao?: { metodo: string; status: string } | null;
};

function formatarDataBR(isoDate: string) {
  const d = new Date(isoDate + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
}

function labelStatus(status: string) {
  const map: Record<string, string> = {
    AGUARDANDO_PAGAMENTO: "Aguard. pagamento",
    CONFIRMADO: "Confirmado",
    CONCLUIDO: "Concluído",
    CANCELADO: "Cancelado",
    PENDENTE: "Pendente",
  };
  return map[status] ?? status;
}

function classeBadge(status: string) {
  switch (status) {
    case "CONFIRMADO":
      return "bg-green-100 text-green-800";
    case "CONCLUIDO":
      return "bg-blue-100 text-blue-800";
    case "AGUARDANDO_PAGAMENTO":
    case "PENDENTE":
      return "bg-amber-100 text-amber-800";
    case "CANCELADO":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

  const carregarAgenda = async () => {
    setCarregando(true);
    try {
      const resposta = await api.get<Agendamento[]>("/agendamentos", {
        params: { data: dataSelecionada },
      });
      setAgendamentos(resposta.data ?? []);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setAgendamentos([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarAgenda();
  }, [dataSelecionada]);

  const atualizarStatus = async (id: string, novoStatus: string) => {
    setAtualizandoId(id);
    try {
      await api.patch(`/agendamentos/${id}/status`, { status: novoStatus });
      await carregarAgenda();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setAtualizandoId(null);
    }
  };

  const finalizarPagamentoDinheiro = async (id: string) => {
    setAtualizandoId(id);
    try {
      await api.post(`/agendamentos/${id}/finalizar-dinheiro`);
      await carregarAgenda();
    } catch (error) {
      console.error("Erro ao finalizar pagamento:", error);
    } finally {
      setAtualizandoId(null);
    }
  };

  const hoje = new Date().toISOString().split("T")[0];
  const amanha = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const setHoje = () => setDataSelecionada(hoje);
  const setAmanha = () => setDataSelecionada(amanha);

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Agendamentos
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Quem você atende hoje? Altere o status com um toque.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          onClick={setHoje}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
            dataSelecionada === hoje
              ? "bg-slate-900 text-white shadow-md"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          Hoje
        </button>
        <button
          type="button"
          onClick={setAmanha}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
            dataSelecionada === amanha
              ? "bg-slate-900 text-white shadow-md"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          Amanhã
        </button>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
          <label htmlFor="data-agenda" className="text-slate-500 text-sm font-medium whitespace-nowrap">
            Escolher:
          </label>
          <input
            id="data-agenda"
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            className="bg-transparent border-0 text-slate-800 text-sm font-bold outline-none cursor-pointer min-w-0"
          />
        </div>
        <span className="text-slate-400 text-sm font-medium ml-1">
          {formatarDataBR(dataSelecionada)}
        </span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {carregando ? (
          <div className="flex-1 flex items-center justify-center py-16">
            <div className="text-slate-500 font-medium">Carregando agendamentos...</div>
          </div>
        ) : agendamentos.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">
              📅
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">
              Agenda livre
            </h3>
            <p className="text-slate-500 text-sm text-center max-w-sm">
              Nenhum agendamento para este dia. Compartilhe o link da sua barbearia com os clientes.
            </p>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto pb-4">
            {agendamentos.map((ag) => {
              const hora = new Date(ag.dataHora).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
              });
              const duracao = ag.servico?.duracao ? ` (${ag.servico.duracao} min)` : "";
              const loading = atualizandoId === ag.id;
              const podeConfirmar = ag.status === "AGUARDANDO_PAGAMENTO";
              const pagamentoDinheiroPendente =
                ag.status === "CONFIRMADO" &&
                ag.transacao?.metodo === "DINHEIRO" &&
                ag.transacao?.status === "PENDENTE";
              const podeConcluir = ag.status === "CONFIRMADO" && !pagamentoDinheiroPendente;
              const podeCancelar = ag.status !== "CANCELADO" && ag.status !== "CONCLUIDO";

              return (
                <div
                  key={ag.id}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-bold text-lg text-slate-900">{hora}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${classeBadge(ag.status)}`}
                    >
                      {labelStatus(ag.status)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">{ag.cliente.nome}</h3>
                    <p className="text-slate-500 text-sm">
                      {ag.servico.nome}
                      {duracao}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">{ag.cliente.telefone}</p>
                    <p className="text-green-600 text-sm font-bold mt-1">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(parseFloat(ag.servico.preco))}
                    </p>
                  </div>

                  {(podeConfirmar || podeConcluir || pagamentoDinheiroPendente || podeCancelar) && (
                    <div className="flex gap-2 mt-1">
                      {podeConfirmar && (
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => atualizarStatus(ag.id, "CONFIRMADO")}
                          className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition disabled:opacity-50"
                        >
                          {loading ? "..." : "Confirmar"}
                        </button>
                      )}
                      {pagamentoDinheiroPendente && (
                        <>
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => finalizarPagamentoDinheiro(ag.id)}
                            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition disabled:opacity-50"
                            title="Cliente pagou em dinheiro"
                          >
                            {loading ? "..." : "✅ Finalizar (Recebido)"}
                          </button>
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => atualizarStatus(ag.id, "CANCELADO")}
                            className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition disabled:opacity-50"
                            title="Cliente não compareceu"
                          >
                            {loading ? "..." : "❌ Cancelar (Faltou)"}
                          </button>
                        </>
                      )}
                      {podeConcluir && (
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => atualizarStatus(ag.id, "CONCLUIDO")}
                          className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition disabled:opacity-50"
                        >
                          {loading ? "..." : "Concluído"}
                        </button>
                      )}
                      {podeCancelar && !pagamentoDinheiroPendente && (
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => atualizarStatus(ag.id, "CANCELADO")}
                          className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition disabled:opacity-50"
                        >
                          {loading ? "..." : "Cancelar"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
