"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function FinanceiroPage() {
  const [dados, setDados] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get("/financeiro")
      .then((res) => setDados(res.data))
      .catch((err) => console.error("Erro ao carregar financeiro", err))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando)
    return (
      <div className="p-8 text-slate-500">Carregando seus ganhos...</div>
    );

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

  return (
    <div className="flex flex-col h-full font-sans max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-950 tracking-tight">
          Financeiro
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Acompanhe as suas receitas e transações via PIX.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
            Total Recebido (Pago)
          </p>
          <p className="text-5xl font-black text-green-600">
            {formatarMoeda(dados?.resumo?.totalRecebido ?? 0)}
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
            Aguardando Pagamento
          </p>
          <p className="text-5xl font-black text-amber-500">
            {formatarMoeda(dados?.resumo?.totalPendente ?? 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-900">Histórico Recente</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-bold">Data</th>
                <th className="p-4 font-bold">Cliente / Serviço</th>
                <th className="p-4 font-bold">Valor</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {dados?.historico?.map((tx: any) => (
                <tr
                  key={tx.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition"
                >
                  <td className="p-4 text-slate-500 font-medium">
                    {new Date(tx.createdAt).toLocaleDateString("pt-BR")} <br />
                    <span className="text-xs">
                      {new Date(tx.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900">
                      {tx.agendamento?.cliente?.nome}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {tx.agendamento?.servico?.nome}
                    </p>
                  </td>
                  <td className="p-4 font-black text-slate-900">
                    {formatarMoeda(Number(tx.valor))}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        tx.status === "PAGO"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!dados?.historico || dados.historico.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-slate-500"
                  >
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
