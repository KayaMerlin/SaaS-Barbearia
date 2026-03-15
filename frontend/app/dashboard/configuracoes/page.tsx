"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import LogoUpload from "@/components/LogoUpload";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";

export default function ConfiguracoesPage() {
  const { usuario, setUsuario } = useAuthStore();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [nomeBarbearia, setNomeBarbearia] = useState("");
  const [horarioAbertura, setHorarioAbertura] = useState("09:00");
  const [horarioFechamento, setHorarioFechamento] = useState("18:00");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);
  const [linkCopiado, setLinkCopiado] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resposta = await api.get("/configuracoes");
        setLogoUrl(resposta.data.logoUrl ?? null);
        setNomeBarbearia(resposta.data.nome ?? "");
        if (resposta.data.horarioAbertura) setHorarioAbertura(resposta.data.horarioAbertura);
        if (resposta.data.horarioFechamento) setHorarioFechamento(resposta.data.horarioFechamento);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
        setMensagem({ tipo: "erro", texto: "Falha ao carregar configurações." });
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  const handleLogoUploadSuccess = (newUrl: string) => {
    setLogoUrl(newUrl || null);
    setMensagem({
      tipo: "sucesso",
      texto: newUrl
        ? "Preview da logo atualizado! Clique em Salvar Alterações para confirmar."
        : "Logo marcada para remoção. Salve para confirmar.",
    });
  };

  const handleLogoUploadError = (message: string) => {
    setMensagem({ tipo: "erro", texto: message });
  };

  const slugAgendamento =
    nomeBarbearia.trim().length > 0
      ? nomeBarbearia.toLowerCase().replace(/\s+/g, "-")
      : "";
  const linkParaClientes =
    typeof window !== "undefined" && slugAgendamento
      ? `${window.location.origin}/agendar/${slugAgendamento}`
      : "";

  const copiarLink = async () => {
    if (!linkParaClientes) return;
    try {
      await navigator.clipboard.writeText(linkParaClientes);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2000);
    } catch {
      setMensagem({ tipo: "erro", texto: "Não foi possível copiar o link." });
    }
  };

  const handleSalvarTudo = async () => {
    setSalvando(true);
    setMensagem(null);
    try {
      await api.put("/configuracoes", {
        logoUrl: logoUrl ?? undefined,
        nomeBarbearia: nomeBarbearia || undefined,
        horarioAbertura,
        horarioFechamento,
      });
      setUsuario({
        nome: (nomeBarbearia || usuario?.nome) ?? "Barbearia",
        logoUrl: logoUrl ?? null,
        statusAssinatura: usuario?.statusAssinatura ?? "AGUARDANDO_PAGAMENTO",
      });
      setMensagem({
        tipo: "sucesso",
        texto: "Configurações salvas com sucesso!",
      });
    } catch (error: unknown) {
      console.error("Erro ao salvar", error);
      const err = error as { response?: { data?: { erro?: string } } };
      setMensagem({
        tipo: "erro",
        texto: err.response?.data?.erro || "Erro ao salvar as configurações.",
      });
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-950 tracking-tight">
          Configurações da Barbearia
        </h2>
        <p className="text-slate-500 text-sm mt-1 max-w-xl">
          Personalize a identidade visual e as informações da sua barbearia no
          painel e para os clientes.
        </p>
      </div>

      <div className="space-y-10 max-w-4xl">
        <LogoUpload
          currentLogoUrl={logoUrl}
          onUploadSuccess={handleLogoUploadSuccess}
          onUploadError={handleLogoUploadError}
        />

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm md:p-10">
          <h3 className="text-xl font-bold text-slate-950 mb-2">
            Informações Básicas
          </h3>
          <p className="text-sm text-slate-500 mb-8 max-w-lg">
            Nome público da barbearia. Será usado no link de agendamento e nas
            comunicações com os clientes.
          </p>

          <div className="max-w-xl">
            <label
              htmlFor="nomeBarbearia"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Nome da Barbearia
            </label>
            <input
              type="text"
              id="nomeBarbearia"
              value={nomeBarbearia}
              onChange={(e) => setNomeBarbearia(e.target.value)}
              placeholder="Ex: Barbearia do Marcos"
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition font-medium text-base shadow-inner bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <label
                htmlFor="horarioAbertura"
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Horário de Abertura
              </label>
              <input
                id="horarioAbertura"
                type="time"
                value={horarioAbertura}
                onChange={(e) => setHorarioAbertura(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition font-medium text-base shadow-inner bg-slate-50"
              />
            </div>
            <div>
              <label
                htmlFor="horarioFechamento"
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Horário de Fechamento
              </label>
              <input
                id="horarioFechamento"
                type="time"
                value={horarioFechamento}
                onChange={(e) => setHorarioFechamento(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition font-medium text-base shadow-inner bg-slate-50"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm md:p-10">
          <h3 className="text-xl font-bold text-slate-950 mb-2">
            Link para seus clientes
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-lg">
            Envie este link para seus clientes agendarem pelo celular ou
            computador. O link usa o nome da barbearia que você configurou acima.
          </p>
          {slugAgendamento ? (
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="text"
                readOnly
                value={linkParaClientes}
                className="flex-1 px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium text-sm"
              />
              <Button
                type="button"
                variant="primary"
                onClick={copiarLink}
                className="whitespace-nowrap"
              >
                {linkCopiado ? "Copiado!" : "Copiar link"}
              </Button>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">
              Salve o nome da barbearia acima para gerar o link de agendamento.
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between gap-6 pb-4">
        {mensagem ? (
          <div
            className={`flex-1 p-4 rounded-xl text-sm font-medium ${
              mensagem.tipo === "sucesso"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {mensagem.texto}
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <Button
          type="button"
          variant="primary"
          isLoading={salvando}
          onClick={handleSalvarTudo}
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
