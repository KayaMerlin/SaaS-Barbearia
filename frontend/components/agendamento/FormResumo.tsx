"use client";

type Servico = { id: string; nome: string; preco: string; duracao?: number };

interface FormResumoProps {
  nome: string;
  setNome: (v: string) => void;
  telefone: string;
  setTelefone: (v: string) => void;
  servicoEscolhido: Servico | null;
  dataEscolhida: string;
  horaEscolhida: string;
  erro: string;
  onSubmit: (e: React.FormEvent) => void;
  salvando: boolean;
}

export default function FormResumo({
  nome,
  setNome,
  telefone,
  setTelefone,
  servicoEscolhido,
  dataEscolhida,
  horaEscolhida,
  erro,
  onSubmit,
  salvando,
}: FormResumoProps) {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300 flex flex-col">
      <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight mb-2">
        Tudo pronto!
      </h2>
      <p className="text-slate-500 text-sm md:text-base mb-8">
        Preencha seus dados para finalizarmos o agendamento.
      </p>

      {erro && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r">
          {erro}
        </div>
      )}

      <form
        id="form-agendamento"
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Seu nome completo
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Pedro da Silva"
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition font-medium text-base shadow-inner bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Seu WhatsApp
            </label>
            <input
              type="tel"
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition font-medium text-base shadow-inner bg-slate-50"
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner md:mt-1 h-fit">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Resumo do pedido
          </h4>
          <p className="text-lg font-bold text-slate-950 mb-1">
            {servicoEscolhido?.nome}
          </p>
          <p className="text-sm text-slate-600 mb-3">
            {dataEscolhida?.split("-").reverse().join("/")} às {horaEscolhida}
          </p>
          <div className="border-t border-slate-200 my-4" />
          <p className="font-black text-blue-700 text-3xl">
            {servicoEscolhido &&
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(parseFloat(servicoEscolhido.preco))}
          </p>
        </div>
      </form>
    </div>
  );
}
