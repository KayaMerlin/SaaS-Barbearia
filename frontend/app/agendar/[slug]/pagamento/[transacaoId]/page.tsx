"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CheckoutPix from "@/components/agendamento/CheckoutPix";
import { api } from "@/lib/api";

const BASE_URL =
  typeof window !== "undefined"
    ? (api.defaults.baseURL ?? "https://saa-s-barbearia-tau.vercel.app")
    : "https://saa-s-barbearia-tau.vercel.app";

type DadosPagamento = {
  status: string;
  codigoPix: string | null;
  valor: number;
  transacaoId: string;
};

export default function PagamentoPixPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const transacaoId = params.transacaoId as string;

  const [barbearia, setBarbearia] = useState<{ nome: string; logoUrl: string | null } | null>(null);
  const [dados, setDados] = useState<DadosPagamento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarPagamento = async () => {
    if (!slug || !transacaoId) return;
    try {
      const res = await fetch(`${BASE_URL}/public/loja/${slug}/pagamento/${transacaoId}`);
      const json = await res.json();
      if (res.ok) {
        setDados({
          status: json.status,
          codigoPix: json.codigoPix ?? null,
          valor: Number(json.valor) || 0,
          transacaoId: json.transacaoId ?? transacaoId,
        });
        setErro(null);
      } else {
        setErro(json.erro || "Pagamento não encontrado.");
      }
    } catch {
      setErro("Erro ao carregar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetch(`${BASE_URL}/public/tenant/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => setBarbearia({ nome: d.nome, logoUrl: d.logoUrl ?? null }))
      .catch(() => setBarbearia(null));
  }, [slug]);

  useEffect(() => {
    buscarPagamento();
  }, [slug, transacaoId]);

  useEffect(() => {
    if (!slug || !transacaoId || !dados || dados.status === "CONFIRMADO") return;
    const radar = setInterval(async () => {
      try {
        const res = await fetch(`${BASE_URL}/public/loja/${slug}/pagamento/${transacaoId}`);
        const json = await res.json();
        if (res.ok && json.status === "CONFIRMADO") {
          setDados((prev) => (prev ? { ...prev, status: "CONFIRMADO" } : null));
        }
      } catch {
        /* ignore */
      }
    }, 3000);
    return () => clearInterval(radar);
  }, [slug, transacaoId, dados?.status]);

  if (carregando && !dados) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center font-sans">
        <p className="text-slate-500 font-medium">Carregando...</p>
      </div>
    );
  }

  if (erro && !dados) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6">
        <span className="text-6xl mb-4">🔗</span>
        <h2 className="text-2xl font-black text-slate-950 mb-2">Link inválido ou expirado</h2>
        <p className="text-slate-600 mb-6">{erro}</p>
        <button
          type="button"
          onClick={() => router.push(`/agendar/${slug}`)}
          className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl"
        >
          Voltar ao agendamento
        </button>
      </div>
    );
  }

  if (dados?.status === "CONFIRMADO") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center font-sans p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
            ✓
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-950 mb-2">
            Pagamento confirmado!
          </h1>
          <p className="text-slate-600 mb-8">
            Seu horário está garantido. Te esperamos na barbearia!
          </p>
          <button
            type="button"
            onClick={() => router.push(`/agendar/${slug}`)}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  if (!dados?.codigoPix) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Aguardando dados do pagamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50 flex justify-center font-sans p-0 sm:p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-none sm:rounded-3xl border border-slate-100 flex flex-col md:flex-row overflow-hidden min-h-screen md:min-h-0">
        {barbearia && (
          <div className="md:w-1/3 bg-slate-950 text-white p-6 md:p-10 flex md:flex-col items-center md:items-start gap-4 border-b md:border-b-0 md:border-r border-slate-800">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-2xl flex-shrink-0">
              {barbearia.logoUrl ? (
                <img src={barbearia.logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-400">BS</span>
              )}
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black tracking-tighter text-white">
                {barbearia.nome}
              </h1>
              <p className="text-blue-400 text-xs md:text-sm mt-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block mr-1" />
                Pagamento PIX
              </p>
            </div>
          </div>
        )}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          <CheckoutPix
            valor={dados.valor}
            codigoPix={dados.codigoPix}
            transacaoId={dados.transacaoId}
            baseUrl={BASE_URL}
            onVoltar={() => router.push(`/agendar/${slug}`)}
            qrCodeBase64={null}
          />
          <p className="text-center text-slate-400 text-sm mt-4">
            Esta tela atualiza sozinha quando o pagamento for confirmado.
          </p>
        </div>
      </div>
    </div>
  );
}
