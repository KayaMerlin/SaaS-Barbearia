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
    qrCodeBase64?: string;
  } | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [jaAtivo, setJaAtivo] = useState(false);
  const [status, setStatus] = useState<{
    dataVencimento: string | null;
    statusAssinatura: string;
    podeAcessarPainel: boolean;
  } | null>(null);

  useEffect(() => {
    const checar = async () => {
      try {
        const res = await api.get("/assinatura/status");
        setStatus({
          dataVencimento: res.data.dataVencimento ?? null,
          statusAssinatura: res.data.statusAssinatura ?? "AGUARDANDO_PAGAMENTO",
          podeAcessarPainel: res.data.podeAcessarPainel === true,
        });
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
        qrCodeBase64: res.data.qrCodeBase64,
      });
    } catch (err) {
      console.error("Erro ao gerar PIX", err);
    } finally {
      setGerandoPix(false);
    }
  };

  const formatarData = (d: string | null) => {
    if (!d) return null;
    try {
      return new Date(d).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    return d;
  };

  const vencido = status
    ? status.dataVencimento && new Date(status.dataVencimento) < new Date()
    : false;

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
          Meu Plano
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Pague a mensalidade de R$ 49,90 via PIX para liberar o painel completo.
        </p>
      </div>

      {vencido && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-800 font-semibold text-sm">
          Sua assinatura está vencida. Gere o PIX abaixo para reativar o painel.
        </div>
      )}

      {status?.dataVencimento && !vencido && (
        <p className="text-slate-600 text-sm mb-4">
          Próximo vencimento: <strong>{formatarData(status.dataVencimento)}</strong>
        </p>
      )}

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
            {gerandoPix ? "Gerando PIX..." : "Gerar PIX da Mensalidade"}
          </button>
        ) : (
          <>
            {dadosPix.qrCodeBase64 && (
              <div className="flex justify-center mb-4">
                <img
                  src={`data:image/png;base64,${dadosPix.qrCodeBase64}`}
                  alt="QR Code PIX"
                  width={200}
                  height={200}
                  className="rounded-xl border border-slate-200"
                />
              </div>
            )}
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
            setStatus({
              dataVencimento: res.data.dataVencimento ?? null,
              statusAssinatura: res.data.statusAssinatura ?? "AGUARDANDO_PAGAMENTO",
              podeAcessarPainel: res.data.podeAcessarPainel === true,
            });
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
