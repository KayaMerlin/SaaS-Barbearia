import Link from "next/link";
import Image from "next/image";

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
            href="#como-funciona"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Como funciona
          </a>
          <a
            href="#preco"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Preço
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
              <div className="mt-10 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/cadastro"
                    className="px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-center"
                  >
                    Experimente grátis por 7 dias
                  </Link>
                  <Link
                    href="/login"
                    className="px-8 py-4 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all text-center"
                  >
                    Já é cadastrado? Login
                  </Link>
                </div>
                <p className="text-sm text-slate-500">
                  ✨ Sem compromisso. Não precisa de cartão de crédito. Cancele quando quiser.
                </p>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="w-full max-w-md aspect-square relative rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/adrianmedia-barber-5764415_1280.png"
                  alt="Barbeiro"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 448px"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="py-24 bg-slate-50 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900">
                Como funciona
              </h2>
              <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
                Três passos e seu cliente agenda sozinho. Você só recebe a notificação e foca na tesoura.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Configure sua barbearia</h3>
                <p className="text-slate-600">
                  Cadastre serviços, preços e horários de funcionamento em menos de 5 minutos.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Compartilhe seu link</h3>
                <p className="text-slate-600">
                  Coloque o link da sua agenda na bio do Instagram ou mande no WhatsApp dos clientes.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Receba os agendamentos</h3>
                <p className="text-slate-600">
                  O cliente escolhe o horário e paga o PIX. Você recebe a notificação e foca no corte.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="preco" className="py-24 bg-white px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900">
                Plano único, sem surpresas
              </h2>
              <p className="text-slate-600 mt-4">
                Comece seu teste de 7 dias. Se o sistema não facilitar sua vida, você não paga nada.
              </p>
            </div>
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 md:p-10 shadow-lg max-w-xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-200 pb-8 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Plano Profissional</h3>
                  <p className="text-3xl font-black text-blue-600 mt-1">R$ 49,90 <span className="text-lg font-normal text-slate-500">/mês</span></p>
                </div>
                <div className="text-left md:text-right text-slate-600 space-y-1">
                  <p>Agenda ilimitada</p>
                  <p>Gestão financeira</p>
                  <p>Link exclusivo para clientes</p>
                  <p>Suporte VIP</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                <p className="font-bold text-amber-900">Teste grátis</p>
                <p className="text-sm text-amber-800">7 dias com acesso total. Sem cartão de crédito.</p>
              </div>
              <Link
                href="/cadastro"
                className="block w-full py-4 bg-black text-white rounded-xl font-bold text-center hover:bg-slate-800 transition"
              >
                Começar teste grátis
              </Link>
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
            <p className="text-center text-slate-600 mt-10 text-sm max-w-2xl mx-auto">
              Diga adeus aos esquecimentos: o sistema pode avisar seus clientes por WhatsApp automaticamente 2 horas antes do corte.
            </p>
          </div>
        </section>

        <section id="contato" className="py-24 bg-white px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pronto para transformar sua barbearia?
              </h2>
              <p className="text-blue-100 text-lg mb-4 max-w-2xl mx-auto">
                Junte-se a centenas de barbeiros que já digitalizaram seus
                negócios. Suporte prioritário e configuração rápida.
              </p>
              <p className="text-blue-200 text-sm mb-10">
                7 dias grátis. Depois, R$ 49,90/mês. Cancele quando quiser.
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
