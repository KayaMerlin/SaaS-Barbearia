"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

type TenantRow = {
  id: string;
  nome: string;
  slug: string | null;
  email: string | null;
  statusAssinatura: string;
  dataVencimento: string | null;
  createdAt: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [faturamentoMes, setFaturamentoMes] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [estendendo, setEstendendo] = useState<string | null>(null);

  useEffect(() => {
    const usuarioStr = typeof window !== "undefined" ? localStorage.getItem("barbersaas_usuario") : null;
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
    if (usuario?.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }
    api
      .get<{ tenants: TenantRow[]; faturamentoMes: number }>("/admin/tenants")
      .then((res) => {
        setTenants(res.data.tenants ?? []);
        setFaturamentoMes(res.data.faturamentoMes ?? 0);
      })
      .catch(() => setTenants([]))
      .finally(() => setCarregando(false));
  }, [router]);

  const estender = (id: string) => {
    setEstendendo(id);
    api
      .patch(`/admin/tenants/${id}/estender`)
      .then(() => {
        return api.get<{ tenants: TenantRow[]; faturamentoMes: number }>("/admin/tenants");
      })
      .then((res) => {
        setTenants(res.data.tenants ?? []);
      })
      .finally(() => setEstendendo(null));
  };

  const formatarData = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <p className="text-slate-500 font-medium">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold">
          Barber<span className="text-blue-400">SaaS</span> Admin
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white">
            Ir ao painel
          </Link>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("barbersaas_token");
              localStorage.removeItem("barbersaas_usuario");
              window.location.href = "/login";
            }}
            className="text-sm text-slate-300 hover:text-white"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Torre de comando</h1>
        <p className="text-slate-600 mb-8">Barbearias cadastradas e faturamento.</p>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
            Faturamento do mês (assinaturas pagas)
          </p>
          <p className="text-4xl font-black text-green-600">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(faturamentoMes)}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-bold text-slate-700">Barbearia</th>
                  <th className="px-4 py-3 font-bold text-slate-700">E-mail</th>
                  <th className="px-4 py-3 font-bold text-slate-700">Status</th>
                  <th className="px-4 py-3 font-bold text-slate-700">Vencimento</th>
                  <th className="px-4 py-3 font-bold text-slate-700">Cadastro</th>
                  <th className="px-4 py-3 font-bold text-slate-700">Ação</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => {
                  const vencido = t.dataVencimento && new Date(t.dataVencimento) < new Date();
                  return (
                    <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">{t.nome}</td>
                      <td className="px-4 py-3 text-slate-600">{t.email ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                            t.statusAssinatura === "ATIVO"
                              ? "bg-green-100 text-green-700"
                              : t.statusAssinatura === "TRIAL"
                                ? "bg-amber-100 text-amber-800"
                                : vencido
                                  ? "bg-red-100 text-red-700"
                                  : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {t.statusAssinatura === "ATIVO" ? "PRO" : t.statusAssinatura === "TRIAL" ? "TESTE" : vencido ? "Vencido" : "Aguardando"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatarData(t.dataVencimento)}</td>
                      <td className="px-4 py-3 text-slate-500 text-sm">{formatarData(t.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => estender(t.id)}
                          disabled={estendendo === t.id}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
                        >
                          {estendendo === t.id ? "..." : "+30 dias"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {tenants.length === 0 && (
            <p className="p-8 text-center text-slate-500">Nenhuma barbearia cadastrada.</p>
          )}
        </div>
      </main>
    </div>
  );
}
