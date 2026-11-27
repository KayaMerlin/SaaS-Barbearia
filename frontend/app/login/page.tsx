"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

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
      const resposta = await api.post("/login", { email, senha });
      const dados = resposta.data;
      localStorage.setItem("barbersaas_token", dados.token);
      if (dados.usuario) localStorage.setItem("barbersaas_usuario", JSON.stringify(dados.usuario));
      router.push(dados.usuario?.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { erro?: string } }; message?: string };
      setErro(err.response?.data?.erro || err.message || "Não foi possível entrar. Confira os dados e tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[#faf7f4] text-[#342a33] lg:grid-cols-2">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#342935] px-12 py-12 text-white lg:flex xl:px-20">
        <div aria-hidden="true" className="absolute -bottom-52 -right-56 h-[650px] w-[650px] rounded-full border-[110px] border-[#ad778b]/20" />
        <div aria-hidden="true" className="absolute right-20 top-40 h-32 w-32 rounded-full bg-[#be8a96]/15 blur-3xl" />
        <Link href="/" className="relative z-10 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#65485a] text-xl text-[#f4c8cf]">✳</span><span className="text-xl font-extrabold tracking-[-.055em]">barber<span className="text-[#e7adbc]">saas</span><span className="ml-1 align-top text-[9px] uppercase tracking-[.2em] text-[#d8afbe]">studio</span></span></Link>
        <div className="relative z-10 max-w-xl"><p className="text-xs font-bold uppercase tracking-[.23em] text-[#deb2c1]">Seu espaço, sua essência</p><h1 className="mt-6 text-6xl font-extrabold leading-[1.12] tracking-[-.06em]">A rotina organizada deixa espaço para <span className="font-serif font-normal italic text-[#ebbfcb]">o que importa.</span></h1><p className="mt-8 max-w-md text-base leading-8 text-[#d0bdca]">Entre para acompanhar seus agendamentos, clientes, serviços e o dia a dia do seu negócio em um só lugar.</p></div>
        <p className="relative z-10 text-xs text-[#b9a4b4]">BarberSaaS Studio · Gestão para quem cuida</p>
      </section>

      <div className="flex min-h-screen flex-col px-5 py-7 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between lg:justify-end"><Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight lg:hidden"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#342935] text-[#ebbfcb]">✳</span> barbersaas</Link><Link href="/" className="rounded-xl px-3 py-2 text-sm font-semibold text-[#8b7b85] transition hover:bg-white hover:text-[#594354]">← Voltar ao início</Link></div>
        <div className="mx-auto my-auto w-full max-w-[440px] pb-12 pt-16 lg:pt-0"><span className="dashboard-eyebrow">Acesso ao seu espaço</span><h2 className="mt-4 text-4xl font-extrabold tracking-[-.05em] text-[#332733] sm:text-5xl">Que bom ter você de volta.</h2><p className="mt-4 text-sm leading-7 text-[#887b84]">Entre com seu e-mail e senha para continuar de onde parou.</p>
          {erro && <div role="alert" className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{erro}</div>}
          <form onSubmit={handleLogin} className="mt-9 space-y-5">
            <div><label htmlFor="email" className="mb-2 block text-sm font-bold text-[#5c4d57]">E-mail</label><input id="email" type="email" required autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="field-input" placeholder="voce@seuespaco.com.br"/></div>
            <div><div className="mb-2 flex items-center justify-between gap-2"><label htmlFor="senha" className="block text-sm font-bold text-[#5c4d57]">Senha</label><Link href="/esqueci-senha" className="text-xs font-semibold text-[#a9697b] hover:underline">Esqueci minha senha</Link></div><input id="senha" type="password" required autoComplete="current-password" value={senha} onChange={(e)=>setSenha(e.target.value)} className="field-input" placeholder="Sua senha"/></div>
            <button type="submit" disabled={carregando} className="action-primary mt-2 w-full py-4 disabled:cursor-wait disabled:opacity-60">{carregando?"Entrando...":"Entrar no painel"} <span aria-hidden="true">↗</span></button>
          </form>
          <p className="mt-8 text-center text-sm text-[#8c7f87]">Ainda não tem conta? <Link href="/cadastro" className="font-bold text-[#a9697b] hover:underline">Criar meu espaço</Link></p>
        </div>
      </div>
    </div>
  );
}
