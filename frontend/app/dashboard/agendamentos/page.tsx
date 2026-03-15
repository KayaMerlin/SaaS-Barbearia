"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Agendamento = {
  id: string;
  dataHora: string;
  status: string;
  servico: { nome: string; preco: string };
  cliente: { nome: string; telefone: string };
};

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  );

  const carregarAgenda = async () => {
    setCarregando(true);
    try {
      const resposta = await api.get<Agendamento[]>("/agendamentos", {
        params: { data: dataSelecionada },
      });
      setAgendamentos(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarAgenda();
  }, [dataSelecionada]);

  const atualizarStatus = async (id: string, novoStatus: string) => {
    try {
      await api.patch(`/agendamentos/${id}/status`, { status: novoStatus });
      carregarAgenda();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Agendamentos
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Gerir os horários marcados para qualquer dia
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-fit">
          <span className="text-slate-500 font-medium pl-2">Data:</span>
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block px-3 py-2 outline-none font-bold cursor-pointer transition"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
        {carregando ? (
          <div className="p-8 text-center text-slate-500 font-medium">
            A procurar agendamentos...
          </div>
        ) : agendamentos.length === 0 ? (
          <div className="p-16 text-center flex-1 flex flex-col justify-center items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📅
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Agenda Livre!
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Não há nenhum agendamento para este dia. Aproveite para partilhar o
              link da sua barbearia no Instagram.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agendamentos.map((agendamento) => {
                  const horaFormatada = new Date(
                    agendamento.dataHora
                  ).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  });

                  return (
                    <tr
                      key={agendamento.id}
                      className="hover:bg-slate-50 transition group"
                    >
                      <td className="p-4">
                        <span className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-black shadow-sm">
                          {horaFormatada}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">
                          {agendamento.cliente.nome}
                        </p>
                        <p className="text-xs text-slate-500">
                          {agendamento.cliente.telefone}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-700">
                          {agendamento.servico.nome}
                        </p>
                        <p className="text-xs text-green-600 font-black">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(parseFloat(agendamento.servico.preco))}
                        </p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                            agendamento.status === "CONFIRMADO"
                              ? "bg-green-100 text-green-700"
                              : agendamento.status === "CONCLUIDO"
                                ? "bg-emerald-100 text-emerald-700"
                                : agendamento.status === "AGUARDANDO_PAGAMENTO"
                                  ? "bg-amber-100 text-amber-700"
                                  : agendamento.status === "PENDENTE"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : agendamento.status === "CANCELADO"
                                      ? "bg-slate-100 text-slate-500"
                                      : "bg-red-100 text-red-700"
                          }`}
                        >
                          {agendamento.status === "AGUARDANDO_PAGAMENTO"
                            ? "Aguard. pagamento"
                            : agendamento.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {(agendamento.status === "PENDENTE" ||
                          agendamento.status === "CONFIRMADO") && (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() =>
                                atualizarStatus(agendamento.id, "CONCLUIDO")
                              }
                              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
                              title="Marcar como Concluído"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() =>
                                atualizarStatus(agendamento.id, "CANCELADO")
                              }
                              className="bg-red-50 border border-red-200 text-red-600 p-2 rounded-lg hover:bg-red-100 transition"
                              title="Cancelar Agendamento"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
