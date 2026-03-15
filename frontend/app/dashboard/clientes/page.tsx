"use client";

import { useEffect, useState, FormEvent } from "react";
import { api } from "@/lib/api";

type Cliente = {
  id: string;
  nome: string;
  telefone: string;
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarClientes = async () => {
    try {
      const resposta = await api.get<Cliente[]>("/clientes");
      setClientes(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleCriarCliente = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      await api.post("/clientes", { nome, telefone });
      setModalAberto(false);
      setNome("");
      setTelefone("");
      carregarClientes();
    } catch (error: any) {
      setErro(error.response?.data?.erro || "Erro ao registrar cliente");
    } finally {
      setSalvando(false);
    }
  };

  const abrirWhatsApp = (numero: string) => {
    const numeroLimpo = numero.replace(/\D/g, "");
    window.open(`https://wa.me/55${numeroLimpo}`, "_blank");
  };

  const handleApagarCliente = async (cliente: Cliente) => {
    if (!confirm(`Apagar o cliente "${cliente.nome}"? Os agendamentos e transações vinculados também serão removidos.`)) return;
    try {
      await api.delete(`/clientes/${cliente.id}`);
      carregarClientes();
    } catch (error: any) {
      alert(error.response?.data?.erro || "Erro ao apagar cliente.");
    }
  };

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Clientes
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            A sua base de dados de clientes e contactos
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span className="text-lg">+</span> Novo Cliente
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex-1">
        {carregando ? (
          <div className="p-8 text-center text-slate-500 font-medium">
            A carregar os seus clientes...
          </div>
        ) : clientes.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              👥
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Nenhum cliente registado
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Os clientes irão aparecer aqui automaticamente quando fizerem um
              agendamento, ou pode adicioná-los manualmente.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nome do Cliente
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Telemóvel / WhatsApp
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="hover:bg-slate-50 transition group"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                        {cliente.nome.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">
                        {cliente.nome}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">
                      {cliente.telefone}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirWhatsApp(cliente.telefone)}
                          className="text-xs font-bold bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 transition inline-flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                          Conversar
                        </button>
                        <button
                          onClick={() => handleApagarCliente(cliente)}
                          className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition inline-flex items-center gap-1"
                          title="Apagar cliente"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Apagar
                        </button>
                      </div>
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
                Novo Cliente
              </h3>
              <button
                onClick={() => setModalAberto(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCriarCliente} className="p-6">
              {erro && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r">
                  {erro}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Nome do Cliente
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Telemóvel (Apenas números)
                  </label>
                  <input
                    type="text"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="11999998888"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition font-medium"
                  />
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
                  {salvando ? "A guardar..." : "Guardar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

