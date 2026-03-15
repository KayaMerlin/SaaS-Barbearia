"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();
  const [nomeBarbearia, setNomeBarbearia] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("http://localhost:4000/barbearias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeBarbearia: nomeBarbearia.trim(),
          nomeUsuario: nomeUsuario.trim(),
          email: email.trim(),
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || dados.mensagem || "Erro ao criar conta");
      }

      router.push("/login?cadastro=ok");
    } catch (error: unknown) {
      setErro(error instanceof Error ? error.message : "Erro ao criar conta");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Crie sua barbearia
          </h2>
          <p className="text-gray-500">
            Comece por R$ 49,90/mês. Preencha os dados abaixo.
          </p>
        </div>

        {erro && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r">
            {erro}
          </div>
        )}

        <form onSubmit={handleCadastro} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome da barbearia
            </label>
            <input
              type="text"
              required
              minLength={3}
              value={nomeBarbearia}
              onChange={(e) => setNomeBarbearia(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              placeholder="Ex: Barbearia do Marcos"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Seu nome
            </label>
            <input
              type="text"
              required
              minLength={3}
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              placeholder="Ex: Marcos Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {carregando ? "Criando conta..." : "Comece agora por R$ 49,90"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
