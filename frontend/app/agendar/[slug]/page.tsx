"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ListaServicos from "@/components/agendamento/ListaServicos";
import CalendarioHorarios from "@/components/agendamento/CalendarioHorarios";
import FormResumo from "@/components/agendamento/FormResumo";
import { api } from "@/lib/api";

const BASE_URL = typeof window !== "undefined" ? api.defaults.baseURL ?? "https://saa-s-barbearia-tau.vercel.app" : "https://saa-s-barbearia-tau.vercel.app";

type TenantPublico = { nome: string; logoUrl: string | null };
type Servico = { id: string; nome: string; preco: string; duracao?: number };
export default function AgendamentoPublico() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [barbearia, setBarbearia] = useState<TenantPublico | null>(null);
  const [carregandoTenant, setCarregandoTenant] = useState(true);
  const [erroTenant, setErroTenant] = useState<string | null>(null);

  const [passo, setPasso] = useState(1);
  const [servicosReais, setServicosReais] = useState<Servico[]>([]);
  const [carregandoServicos, setCarregandoServicos] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [servicoEscolhido, setServicoEscolhido] = useState<Servico | null>(null);
  const [dataEscolhida, setDataEscolhida] = useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [horaEscolhida, setHoraEscolhida] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetch(`${BASE_URL}/public/tenant/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => setBarbearia({ nome: d.nome, logoUrl: d.logoUrl ?? null }))
      .catch(async (r) => {
        const d = await r.json().catch(() => ({}));
        setErroTenant(d.erro || "Barbearia não encontrada.");
      })
      .finally(() => setCarregandoTenant(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    fetch(`${BASE_URL}/public/loja/${slug}/servicos?_t=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setServicosReais)
      .catch(async (r) => {
        const d = await r.json().catch(() => ({}));
        setErro(d.erro || "Barbearia não encontrada.");
        setServicosReais([]);
      })
      .finally(() => setCarregandoServicos(false));
  }, [slug]);

  useEffect(() => {
    if (!slug || !dataEscolhida || !servicoEscolhido?.id) {
      setHorariosDisponiveis([]);
      setHoraEscolhida("");
      return;
    }
    setCarregandoHorarios(true);
    setHoraEscolhida("");
    fetch(
      `${BASE_URL}/public/loja/${slug}/horarios?data=${dataEscolhida}&servicoId=${servicoEscolhido.id}`
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => setHorariosDisponiveis(Array.isArray(d) ? d : []))
      .then(() => setErro(""))
      .catch(async (r) => {
        const d = await r.json().catch(() => ({}));
        setHorariosDisponiveis([]);
        setErro(d.erro || "Não foi possível carregar os horários.");
      })
      .finally(() => setCarregandoHorarios(false));
  }, [slug, dataEscolhida, servicoEscolhido?.id]);

  const handleFinalizar = async (e: React.FormEvent) => {
    e.preventDefault();
    const nomeLimpo = nome.trim();
    const telefoneLimpo = telefone.replace(/\D/g, "");
    if (nomeLimpo.length < 3 || !/^[a-zA-ZÀ-ÿ\s]+$/.test(nomeLimpo)) {
      setErro("Digite um nome válido (apenas letras, no mínimo 3 caracteres).");
      return;
    }
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      setErro("Digite um telefone válido com DDD (ex: 11999999999).");
      return;
    }
    setSalvando(true);
    setErro("");
    const dataHoraISO = `${dataEscolhida}T${horaEscolhida}:00-03:00`;
    try {
      const resposta = await fetch(`${BASE_URL}/public/loja/${slug}/agendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicoId: servicoEscolhido!.id,
          dataHora: dataHoraISO,
          nome: nomeLimpo,
          telefone: telefone.trim(),
        }),
      });
      const dados = await resposta.json();
      if (resposta.ok) {
        const id = dados.transacaoId ?? "";
        if (id) router.push(`/agendar/${slug}/pagamento/${id}`);
        else setErro("Resposta inválida. Tente novamente.");
      } else {
        setErro(dados.erro || "Ops! Ocorreu um erro ao agendar.");
      }
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregandoTenant && !barbearia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center font-sans">
        <div className="text-slate-500 font-medium">Carregando...</div>
      </div>
    );
  }

  if (erroTenant || !barbearia) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6">
        <span className="text-6xl mb-4">🏠</span>
        <h2 className="text-3xl font-black text-slate-950 tracking-tight mb-2">
          Página não encontrada
        </h2>
        <p className="text-lg text-slate-600 max-w-lg mb-8">
          O link pode estar incorreto ou a barbearia está inativa.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50 flex justify-center font-sans p-0 sm:p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-none sm:rounded-3xl border border-slate-100 flex flex-col md:flex-row overflow-hidden relative min-h-screen md:min-h-0">
        <div className="md:w-1/3 bg-slate-950 text-white p-6 md:p-10 flex md:flex-col items-center md:items-start md:justify-start gap-4 md:gap-8 border-b md:border-b-0 md:border-r border-slate-800">
          <div className="flex md:flex-col items-center md:items-start gap-4">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-2xl md:text-3xl shadow-xl flex-shrink-0">
              {barbearia.logoUrl ? (
                <img src={barbearia.logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-400">BS</span>
              )}
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black tracking-tighter text-white leading-tight">
                {barbearia.nome}
              </h1>
              <p className="text-blue-400 text-xs md:text-sm flex items-center gap-1 mt-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Aberto para agendamentos
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-12 overflow-y-auto pb-32 md:pb-12">
          {passo === 1 && (
            <ListaServicos
              servicos={servicosReais}
              servicoEscolhido={servicoEscolhido}
              onSelect={setServicoEscolhido}
              carregando={carregandoServicos}
              erro={erro}
            />
          )}
          {passo === 2 && (
            <CalendarioHorarios
              dataEscolhida={dataEscolhida}
              onDataChange={setDataEscolhida}
              servicoEscolhido={servicoEscolhido}
              horariosDisponiveis={horariosDisponiveis}
              carregandoHorarios={carregandoHorarios}
              horaEscolhida={horaEscolhida}
              onHoraSelect={setHoraEscolhida}
              erro={erro}
            />
          )}
          {passo === 3 && (
            <FormResumo
              nome={nome}
              setNome={setNome}
              telefone={telefone}
              setTelefone={setTelefone}
              servicoEscolhido={servicoEscolhido}
              dataEscolhida={dataEscolhida}
              horaEscolhida={horaEscolhida}
              erro={erro}
              onSubmit={handleFinalizar}
              salvando={salvando}
            />
          )}
        </div>

        {passo < 4 && (
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-20 md:relative md:flex md:flex-col md:w-60 md:min-w-[240px] md:border-l md:border-slate-100 md:bg-slate-50 md:shadow-none md:justify-end md:p-8">
            <div className="flex gap-4 md:flex-col md:gap-4">
              {passo > 1 && (
                <button
                  type="button"
                  onClick={() => setPasso(passo - 1)}
                  className="px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition md:w-full"
                >
                  Voltar
                </button>
              )}
              {passo === 1 && (
                <button
                  type="button"
                  disabled={!servicoEscolhido}
                  onClick={() => setPasso(2)}
                  className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:bg-slate-300 transition shadow-md shadow-blue-600/20 md:w-full"
                >
                  Continuar
                </button>
              )}
              {passo === 2 && (
                <button
                  type="button"
                  disabled={!dataEscolhida || !horaEscolhida}
                  onClick={() => setPasso(3)}
                  className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:bg-slate-300 transition shadow-md shadow-blue-600/20 md:w-full"
                >
                  Confirmar horário
                </button>
              )}
              {passo === 3 && (
                <button
                  type="submit"
                  form="form-agendamento"
                  disabled={salvando}
                  className="flex-1 bg-green-500 text-white font-black py-4 rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-500/20 text-lg disabled:opacity-70 md:w-full md:text-xl"
                >
                  {salvando ? "Aguarde..." : "Agendar agora"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
