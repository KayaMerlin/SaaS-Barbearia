"use client";

type Servico = { id: string; nome: string; preco: string; duracao?: number };

interface ListaServicosProps {
  servicos: Servico[];
  servicoEscolhido: Servico | null;
  onSelect: (s: Servico) => void;
  carregando: boolean;
  erro: string;
}

export default function ListaServicos({
  servicos,
  servicoEscolhido,
  onSelect,
  carregando,
  erro,
}: ListaServicosProps) {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight mb-2">
        Qual serviço você deseja?
      </h2>
      <p className="text-slate-500 text-sm md:text-base mb-8">
        Escolha abaixo o procedimento que você quer agendar.
      </p>

      {carregando ? (
        <p className="text-slate-500 text-sm text-center mt-10">
          Buscando serviços...
        </p>
      ) : erro && servicos.length === 0 ? (
        <p className="text-slate-500 text-sm text-center mt-10">{erro}</p>
      ) : servicos.length === 0 ? (
        <p className="text-slate-500 text-sm text-center mt-10">
          Esta barbearia ainda não possui serviços cadastrados.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servicos.map((servico) => (
            <div
              key={servico.id}
              onClick={() => onSelect(servico)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between min-h-[120px] ${
                servicoEscolhido?.id === servico.id
                  ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-500/10"
                  : "border-slate-100 bg-white hover:border-slate-300"
              }`}
            >
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1">
                  {servico.nome}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium mb-3">
                  ⏱ Duração: {servico.duracao ?? 0} min
                </p>
              </div>
              <span className="font-black text-blue-700 text-lg md:text-xl">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(parseFloat(servico.preco))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
