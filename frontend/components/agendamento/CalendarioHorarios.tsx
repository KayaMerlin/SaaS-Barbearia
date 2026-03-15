"use client";

type Servico = { id: string; nome?: string; preco?: string; duracao?: number };

interface CalendarioHorariosProps {
  dataEscolhida: string;
  onDataChange: (iso: string) => void;
  servicoEscolhido: Servico | null;
  horariosDisponiveis: string[];
  carregandoHorarios: boolean;
  horaEscolhida: string;
  onHoraSelect: (hora: string) => void;
  erro: string;
}

export default function CalendarioHorarios({
  dataEscolhida,
  onDataChange,
  horariosDisponiveis,
  carregandoHorarios,
  horaEscolhida,
  onHoraSelect,
  erro,
}: CalendarioHorariosProps) {
  const toYYYYMMDD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const dias = [0, 1, 2, 3, 4, 5, 6].map((diaOffset) => {
    const data = new Date();
    data.setDate(data.getDate() + diaOffset);
    const isoDate = toYYYYMMDD(data);
    const dataFormatada = data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
    let label = "";
    if (diaOffset === 0) label = "Hoje";
    else if (diaOffset === 1) label = "Amanhã";
    else
      label = data
        .toLocaleDateString("pt-BR", { weekday: "short" })
        .replace(".", "");
    return { isoDate, dataFormatada, label };
  });

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight mb-2">
        Para quando?
      </h2>
      <p className="text-slate-500 text-sm md:text-base mb-8">
        Selecione uma data e um horário disponível abaixo.
      </p>

      <div className="mb-10">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {dias.map(({ isoDate, dataFormatada, label }) => (
            <button
              key={isoDate}
              type="button"
              onClick={() => onDataChange(isoDate)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-[80px] md:w-[96px] h-[88px] md:h-[104px] rounded-2xl border-2 transition ${
                dataEscolhida === isoDate
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10"
                  : "border-slate-100 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              <span className="text-[11px] md:text-xs font-bold uppercase mb-1">
                {label}
              </span>
              <span
                className={`text-2xl md:text-3xl font-black ${
                  dataEscolhida === isoDate ? "text-blue-700" : "text-slate-950"
                }`}
              >
                {dataFormatada}
              </span>
            </button>
          ))}
        </div>
      </div>

      {dataEscolhida && (
        <div className="animate-in fade-in duration-300">
          <label className="block text-sm md:text-base font-bold text-slate-700 mb-4">
            Horários disponíveis:
          </label>
          {carregandoHorarios ? (
            <p className="text-slate-500 text-sm py-4">Carregando horários...</p>
          ) : horariosDisponiveis.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">
              Nenhum horário disponível para esta data e serviço.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {horariosDisponiveis.map((hora) => (
                <button
                  key={hora}
                  type="button"
                  onClick={() => onHoraSelect(hora)}
                  className={`py-3.5 rounded-xl font-bold text-sm md:text-base transition ${
                    horaEscolhida === hora
                      ? "bg-slate-950 text-white shadow-lg"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {hora}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
