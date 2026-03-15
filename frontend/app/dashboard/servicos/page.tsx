"use client";

import { useEffect, useState, FormEvent } from "react";
import { api } from "@/lib/api";

type Servico = {
  id: string;
  nome: string;
  preco: string;
  duracao: number;
};

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [duracao, setDuracao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarServicos = async () => {
    try {
      const resposta = await api.get<Servico[]>("/servicos");
      setServicos(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  const handleCriarServico = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      await api.post("/servicos", {
        nome,
        preco: Number(preco),
        duracao: Number(duracao),
      });

      setModalAberto(false);
      setNome("");
      setPreco("");
      setDuracao("");
      carregarServicos();
    } catch (error: any) {
      setErro(error.response?.data?.erro || "Erro ao criar serviço");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Serviços
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie os cortes e valores da sua barbearia
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span className="text-lg">+</span> Novo Serviço
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex-1">
        {carregando ? (
          <div className="p-8 text-center text-slate-500 font-medium">
            Carregando seus serviços...
          </div>
        ) : servicos.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ✂️
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Nenhum serviço cadastrado
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Você ainda não adicionou nenhum serviço. Clique no botão acima
              para começar a montar o seu cardápio.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nome do Serviço
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Duração
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {servicos.map((servico) => (
                  <tr
                    key={servico.id}
                    className="hover:bg-slate-50 transition group"
                  >
                    <td className="p-4 font-bold text-slate-900">
                      {servico.nome}
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium">
                      {servico.duracao} min
                    </td>
                    <td className="p-4 text-sm font-black text-green-600">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(parseFloat(servico.preco))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900">
                Novo Serviço
              </h3>
              <button
                onClick={() => setModalAberto(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCriarServico} className="p-6">
              {erro && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r">
                  {erro}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Nome do Serviço
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Corte Degradê"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition font-medium"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Preço (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      placeholder="45.00"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition font-medium"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Duração (min)
                    </label>
                    <input
                      type="number"
                      required
                      value={duracao}
                      onChange={(e) => setDuracao(e.target.value)}
                      placeholder="40"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-70"
                >
                  {salvando ? "Salvando..." : "Salvar Serviço"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

