"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || dados.mensagem || "Erro ao fazer login");
      }

      localStorage.setItem("barbersaas_token", dados.token);
      router.push("/dashboard");
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Bem-vindo de volta
          </h2>
          <p className="text-gray-500">Acesse o painel da sua barbearia</p>
        </div>

        {erro && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
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
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            isLoading={carregando}
            className="w-full"
          >
            Entrar no Sistema
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Ainda não tem uma conta?{" "}
          <Link href="/cadastro" className="text-blue-600 font-semibold hover:underline">
            Crie sua barbearia
          </Link>
        </p>
      </div>
    </div>
  );
}

