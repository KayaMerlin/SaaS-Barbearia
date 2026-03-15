import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <header className="flex items-center justify-between px-6 md:px-10 py-6 max-w-7xl mx-auto">
        <Link href="#inicio" className="text-2xl font-extrabold tracking-tighter">
          Barber<span className="text-blue-600">SaaS</span>
        </Link>
        <nav className="flex gap-6">
          <a
            href="#inicio"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Início
          </a>
          <a
            href="#produto"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Produto
          </a>
          <a
            href="#contato"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Contato
          </a>
        </nav>
      </header>

      <main className="scroll-smooth">
        <section
          id="inicio"
          className="min-h-[90vh] flex items-center bg-white px-6 pt-4 pb-16"
        >
          <div className="container mx-auto max-w-7xl grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                O seu sistema de <br />
                <span className="text-blue-600">barbearia</span> começa agora.
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-lg">
                Gerencie seus clientes, horários e faturamento em um só lugar. A
                plataforma definitiva para barbeiros modernos.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/cadastro"
                  className="px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-center"
                >
                  Comece agora por R$ 49,90
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all text-center"
                >
                  Já é cadastrado? Login
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="w-full max-w-md aspect-square bg-slate-100 rounded-3xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <svg
                  className="w-20 h-20 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-bold uppercase tracking-widest text-sm">
                  Imagem 1 Barbeiro
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="produto" className="py-24 bg-slate-50 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900">
                Tudo o que você precisa
              </h2>
              <p className="text-slate-600 mt-4">
                Funcionalidades pensadas para escalar seu negócio.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Agenda Inteligente</h3>
                <p className="text-slate-600">
                  Evite furos e organize seus horários de forma automática e
                  intuitiva.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Controle Financeiro</h3>
                <p className="text-slate-600">
                  Saiba exatamente quanto ganhou no dia, na semana e no mês com
                  relatórios claros.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Gestão de Clientes</h3>
                <p className="text-slate-600">
                  Histórico completo de cada cliente para oferecer um atendimento
                  personalizado.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contato" className="py-24 bg-white px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pronto para transformar sua barbearia?
              </h2>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                Junte-se a centenas de barbeiros que já digitalizaram seus
                negócios. Suporte prioritário e configuração rápida.
              </p>
              <a
                href="https://wa.me/5571982839538"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg"
              >
                Falar com um Consultor
              </a>
              <div className="mt-8 text-blue-200 text-sm space-y-1">
                <p>
                  <a
                    href="mailto:kayavictorsantosocorreia@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    kayavictorsantosocorreia@gmail.com
                  </a>
                </p>
                <p>
                  <a
                    href="https://wa.me/5571982839538"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    (71) 98283-9538
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 border-t border-slate-100 text-center text-slate-400 text-sm">
          &copy; 2026 BarberSaaS. Todos os direitos reservados.
        </footer>
      </main>
    </div>
  );
}
