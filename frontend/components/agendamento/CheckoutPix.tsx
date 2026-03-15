"use client";

import { useState, useEffect } from "react";

interface CheckoutPixProps {
  valor: number;
  codigoPix: string;
  transacaoId: string;
  baseUrl: string;
  onVoltar: () => void;
  qrCodeBase64?: string | null;
}

export default function CheckoutPix({
  valor,
  codigoPix,
  transacaoId,
  baseUrl,
  onVoltar,
  qrCodeBase64,
}: CheckoutPixProps) {
  const [copiado, setCopiado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(600);

  useEffect(() => {
    if (tempoRestante <= 0) return;
    const timer = setInterval(() => setTempoRestante((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [tempoRestante]);

  const minutos = Math.floor(tempoRestante / 60)
    .toString()
    .padStart(2, "0");
  const segundos = (tempoRestante % 60).toString().padStart(2, "0");

  const copiarPix = () => {
    navigator.clipboard.writeText(codigoPix);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const simularPagamento = async () => {
    if (!transacaoId) return;
    try {
      const res = await fetch(`${baseUrl}/webhook/pix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transacaoId,
          statusPagamento: "PAGO",
        }),
      });
      if (res.ok) {
        alert("Pagamento simulado. O barbeiro verá o agendamento confirmado.");
      } else {
        alert("Erro ao simular pagamento.");
      }
    } catch {
      alert("Erro ao simular pagamento.");
    }
  };

  return (
    <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center text-center pt-4 md:pt-10">
      <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg shadow-blue-100/50">
        💲
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-slate-950 mb-2 tracking-tighter">
        Quase lá!
      </h2>
      <p className="text-sm md:text-base text-slate-500 mb-6 max-w-sm">
        Realize o pagamento via PIX para confirmar seu horário.
      </p>

      <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 py-2 px-4 rounded-full w-max mx-auto mb-6 font-medium text-sm">
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Reserva expira em {minutos}:{segundos}</span>
      </div>

      <div className="w-full max-w-sm bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm mb-6">
        <p className="text-sm text-slate-500 mb-1 font-bold">Valor a pagar</p>
        <p className="text-4xl font-black text-blue-700 mb-6">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(valor)}
        </p>

        {qrCodeBase64 && (
          <div className="flex justify-center mb-4">
            <img
              src={`data:image/png;base64,${qrCodeBase64}`}
              alt="QR Code PIX"
              className="w-48 h-48 rounded-xl border border-slate-200 p-2 bg-white"
            />
          </div>
        )}

        <div className="bg-white p-3 rounded-xl border border-slate-200 mb-4">
          <span className="text-xs text-slate-400 font-mono truncate select-all block">
            {codigoPix}
          </span>
        </div>

        <button
          type="button"
          onClick={copiarPix}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition shadow-md ${
            copiado
              ? "bg-green-500 text-white"
              : "bg-slate-950 text-white hover:bg-black"
          }`}
        >
          {copiado ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Código copiado!
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copiar código PIX
            </>
          )}
        </button>

        <button
          type="button"
          onClick={simularPagamento}
          className="w-full mt-4 py-3 rounded-xl font-bold text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 transition border border-purple-200 border-dashed"
        >
          Simular pagamento PIX (portfólio)
        </button>
      </div>

      <p className="text-xs text-slate-400 mb-4 max-w-xs">
        Após o pagamento, o barbeiro confirmará seu agendamento no sistema.
      </p>

      <button
        type="button"
        onClick={onVoltar}
        className="text-slate-500 font-bold text-sm hover:text-slate-900 transition underline"
      >
        Já paguei / Voltar ao início
      </button>
    </div>
  );
}
