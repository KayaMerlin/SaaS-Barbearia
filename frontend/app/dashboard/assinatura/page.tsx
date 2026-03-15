"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const VALOR_MENSALIDADE = 49.9;

export default function AssinaturaPage() {
  const router = useRouter();
  const [carregandoStatus, setCarregandoStatus] = useState(true);
  const [gerandoPix, setGerandoPix] = useState(false);
  const [dadosPix, setDadosPix] = useState<{
    codigoPix: string;
    valor: number;
    pagamentoId: string;
  } | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [jaAtivo, setJaAtivo] = useState(false);

  useEffect(() => {
    const checar = async () => {
      try {
        const res = await api.get("/assinatura/status");
        if (res.data.podeAcessarPainel === true) {
          setJaAtivo(true);
          router.replace("/dashboard");
          return;
        }
      } catch {
      } finally {
        setCarregandoStatus(false);
      }
    };
    checar();
  }, [router]);

  const gerarPix = async () => {
    setGerandoPix(true);
    setDadosPix(null);
    try {
      const res = await api.post("/assinatura/gerar-pix");
      setDadosPix({
        codigoPix: res.data.codigoPix ?? "",
        valor: Number(res.data.valor) || VALOR_MENSALIDADE,
        pagamentoId: res.data.pagamentoId ?? "",
      });
    } catch (err) {
      console.error("Erro ao gerar PIX", err);
    } finally {
      setGerandoPix(false);
    }
  };

  if (carregandoStatus || jaAtivo) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-xl mx-auto font-sans">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-950 tracking-tight">
          Ative sua assinatura
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Pague a mensalidade de R$ 49,90 via PIX para liberar o painel completo.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
        <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
          Valor da mensalidade
        </p>
        <p className="text-5xl font-black text-blue-700 mb-8">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(VALOR_MENSALIDADE)}
        </p>

        {!dadosPix ? (
          <button
            type="button"
            onClick={gerarPix}
            disabled={gerandoPix}
            className="w-full py-4 rounded-xl font-bold text-base bg-slate-950 text-white hover:bg-black transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {gerandoPix ? "Gerando PIX..." : "Gerar PIX Copia e Cola"}
          </button>
        ) : (
          <>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 mb-4">
              <span className="text-xs text-slate-400 font-mono truncate select-all break-all">
                {dadosPix.codigoPix}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(dadosPix.codigoPix);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 3000);
              }}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition shadow-md ${
                copiado
                  ? "bg-green-500 text-white"
                  : "bg-slate-950 text-white hover:bg-black"
              }`}
            >
              {copiado ? "✓ Código copiado!" : "Copiar código PIX"}
            </button>

            <button
              type="button"
              onClick={async () => {
                if (!dadosPix?.pagamentoId) return;
                try {
                  await api.post("/webhook/assinatura", {
                    pagamentoId: dadosPix.pagamentoId,
                    statusPagamento: "PAGO",
                  });
                  alert("Webhook disparado. Clique em \"Já paguei\" para liberar o painel.");
                } catch {
                  alert("Erro ao simular webhook.");
                }
              }}
              className="w-full mt-4 py-3 rounded-xl font-bold text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 transition border border-purple-200 border-dashed"
            >
              Simular pagamento (modo teste)
            </button>

            <p className="text-xs text-slate-500 mt-4 text-center">
              Após o pagamento, o painel será liberado em instantes. Clique em
              &quot;Já paguei&quot; para atualizar.
            </p>
            <button
              type="button"
              onClick={gerarPix}
              className="w-full mt-3 py-2 text-slate-500 font-medium text-sm hover:text-slate-900 transition"
            >
              Gerar novo PIX
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={async () => {
          try {
            const res = await api.get("/assinatura/status");
            if (res.data.podeAcessarPainel) router.replace("/dashboard");
          } catch {
          }
        }}
        className="mt-8 text-slate-500 font-bold text-sm hover:text-slate-900 transition underline"
      >
        Já paguei / Atualizar status
      </button>
    </div>
  );
}
