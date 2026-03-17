"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";

export default function EsqueciSenhaPage() {
  const router = useRouter();
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [telefone, setTelefone] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  const handleEnviarTelefone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (telefone.length < 10) {
      setMensagem({ tipo: "erro", texto: "Digite um telefone válido com DDD." });
      return;
    }

    setCarregando(true);
    setMensagem(null);
    try {
      await api.post("/auth/esqueci-senha", { telefone });
      setMensagem({ tipo: "sucesso", texto: "Código enviado! Verifique seu WhatsApp." });
      setEtapa(2);
    } catch (error: any) {
      setMensagem({
        tipo: "erro",
        texto: error.response?.data?.erro || "Erro ao enviar código. Verifique se o telefone está cadastrado.",
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleValidarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigo.length !== 4) {
      setMensagem({ tipo: "erro", texto: "O código deve ter 4 dígitos." });
      return;
    }
    setMensagem(null);
    setEtapa(3);
  };

  const handleResetarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha.length < 6) {
      setMensagem({ tipo: "erro", texto: "A nova senha deve ter pelo menos 6 caracteres." });
      return;
    }

    setCarregando(true);
    setMensagem(null);
    try {
      await api.post("/auth/resetar-senha", { telefone, codigo, novaSenha });
      setMensagem({ tipo: "sucesso", texto: "Senha alterada com sucesso! Redirecionando..." });
      setTimeout(() => router.push("/login"), 2500);
    } catch (error: any) {
      setMensagem({ tipo: "erro", texto: error.response?.data?.erro || "Código inválido ou expirado." });
      setEtapa(2);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recuperar Senha</h1>
          <p className="text-sm text-slate-500 mt-2">
            {etapa === 1 && "Digite seu celular para receber o código via WhatsApp."}
            {etapa === 2 && `Enviamos um código para ${telefone}`}
            {etapa === 3 && "Crie uma nova senha segura para sua conta."}
          </p>
        </div>

        {mensagem && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-medium ${
              mensagem.tipo === "sucesso" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {mensagem.texto}
          </div>
        )}

        {etapa === 1 && (
          <form onSubmit={handleEnviarTelefone} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Celular com DDD</label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex: 11999999999"
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 font-medium"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" isLoading={carregando}>
              Enviar Código
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Voltar para o Login
              </button>
            </div>
          </form>
        )}

        {etapa === 2 && (
          <form onSubmit={handleValidarCodigo} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Código de 4 Dígitos</label>
              <input
                type="text"
                maxLength={4}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
                placeholder="0000"
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 font-medium text-center text-2xl tracking-[0.5em]"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Continuar
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setEtapa(1)}
                className="text-sm text-slate-500 font-medium hover:underline"
              >
                Corrigir número
              </button>
            </div>
          </form>
        )}

        {etapa === 3 && (
          <form onSubmit={handleResetarSenha} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nova Senha</label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50 font-medium"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" isLoading={carregando}>
              Salvar Nova Senha
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

