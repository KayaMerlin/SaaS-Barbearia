import Link from "next/link";

const recursos = [
  { numero: "01", titulo: "Agenda organizada", descricao: "Visualize os horários e acompanhe cada atendimento sem perder o ritmo do dia.", icone: "agenda" },
  { numero: "02", titulo: "Seus clientes em um lugar", descricao: "Consulte contatos e agendamentos para oferecer uma experiência mais atenciosa.", icone: "clientes" },
  { numero: "03", titulo: "Pagamentos com clareza", descricao: "Ofereça as formas de pagamento habilitadas no estabelecimento e acompanhe sua operação.", icone: "pagamentos" },
  { numero: "04", titulo: "Visão do seu negócio", descricao: "Veja agendamentos, serviços e o resumo financeiro em um painel intuitivo.", icone: "relatorios" },
] as const;

const segmentos = [
  { titulo: "Barbearias", descricao: "Mais organização entre um corte e outro.", exemplos: "Corte · Barba · Acabamento" },
  { titulo: "Salões de beleza", descricao: "Uma rotina mais leve para quem cuida dos detalhes.", exemplos: "Cabelo · Unhas · Produção" },
  { titulo: "Espaços de estética", descricao: "Cada atendimento com o tempo e a atenção que merece.", exemplos: "Facial · Corporal · Bem-estar" },
] as const;

function Icone({ tipo }: { tipo: "agenda" | "clientes" | "pagamentos" | "relatorios" }) {
  const paths = {
    agenda: "M8 3v4m8-4v4M4 10h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
    clientes: "M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm18-7.87a4 4 0 0 1 0 7.75",
    pagamentos: "M20 7V5a2 2 0 0 0-2-2H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H6a3 3 0 0 1-3-3m19 7h-6a2 2 0 0 0 0 4h6",
    relatorios: "M4 19V5m0 14h16M8 15l4-5 3 2 5-7",
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d={paths[tipo]} /></svg>;
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#faf7f4] text-[#302630]">
      <header className="relative z-20 border-b border-[#e9e1da] bg-[#faf7f4]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" aria-label="BarberSaaS, página inicial" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#332733] text-xl text-[#f0cdba]">✳</span>
            <span className="text-xl font-extrabold tracking-[-.065em]">barber<span className="text-[#b87480]">saas</span><span className="ml-1 align-top text-[9px] font-bold uppercase tracking-[.2em] text-[#ad9092]">studio</span></span>
          </Link>
          <nav aria-label="Menu principal" className="hidden items-center gap-8 text-sm font-semibold text-[#736974] md:flex">
            <a href="#recursos" className="transition-colors hover:text-[#a45b6e]">Recursos</a>
            <a href="#segmentos" className="transition-colors hover:text-[#a45b6e]">Para quem é</a>
            <a href="#como-funciona" className="transition-colors hover:text-[#a45b6e]">Como funciona</a>
            <a href="#planos" className="transition-colors hover:text-[#a45b6e]">Planos</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="rounded-xl px-2 py-3 text-sm font-semibold text-[#51454e] transition hover:bg-white sm:px-4">Entrar</Link>
            <Link href="/cadastro" className="rounded-xl bg-[#332733] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#594354] sm:px-5 sm:text-sm">Criar conta <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative isolate px-5 pb-20 pt-16 sm:px-8 lg:pb-28 lg:pt-24">
          <div aria-hidden="true" className="pointer-events-none absolute -right-64 -top-40 -z-10 h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,#efdad7_0%,transparent_68%)] opacity-80" />
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.98fr_1.02fr] lg:gap-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e9d9d4] bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#a46371]"><span className="h-2 w-2 rounded-full bg-[#b87480]" /> A nova rotina do seu espaço</div>
              <h1 className="mt-8 text-[clamp(3rem,5.4vw,5.7rem)] font-extrabold leading-[1.08] tracking-[-.07em] text-[#332733]">
                Seu talento cuida.<br /><span className="font-serif font-normal italic text-[#b87480]">Sua gestão flui.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-[#766c73] sm:text-lg">Agenda, clientes, serviços e financeiro em um só lugar. Uma experiência simples e bonita para quem vive de atender bem.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/cadastro" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#332733] px-8 py-4 text-sm font-bold text-white shadow-[0_15px_30px_rgba(51,39,51,.18)] transition hover:-translate-y-0.5 hover:bg-[#594354]">Começar meu espaço <span className="text-lg" aria-hidden="true">↗</span></Link>
                <a href="#recursos" className="inline-flex items-center justify-center rounded-2xl border border-[#e5d9d5] bg-white px-8 py-4 text-sm font-bold text-[#4b3d48] transition hover:border-[#c79ba3]">Conhecer a plataforma</a>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-[#867a80] sm:text-sm">
                <span className="flex items-center gap-2"><span className="text-[#b87480]">✓</span> Agendamento online</span>
                <span className="flex items-center gap-2"><span className="text-[#b87480]">✓</span> Gestão em um painel</span>
                <span className="flex items-center gap-2"><span className="text-[#b87480]">✓</span> Acesso pelo celular</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[565px] py-8 lg:py-12">
              <div aria-hidden="true" className="absolute inset-2 -rotate-3 rounded-[44px] bg-[#e9d4d2]" />
              <div className="relative rounded-[28px] border border-[#e9e3df] bg-white p-4 shadow-[0_30px_100px_rgba(64,42,55,.18)] sm:rounded-[32px] sm:p-6">
                <div className="flex items-center justify-between border-b border-[#f0e9e6] pb-5">
                  <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f9e9e6] text-lg text-[#b87480]">✳</div><div><p className="text-sm font-extrabold tracking-tight text-[#352a33]">Meu espaço</p><p className="text-[11px] text-[#93858e]">Visão da agenda</p></div></div>
                  <span className="rounded-full bg-[#eaf7ee] px-3 py-1 text-[11px] font-bold text-[#387454]">Tudo em ordem</span>
                </div>
                <div className="flex items-end justify-between gap-3 py-6"><div><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#ac969d]">Uma rotina mais leve</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#382b35] sm:text-3xl">Agenda do dia</h2></div><span className="rounded-xl border border-[#eee4e1] px-3 py-2 text-xs font-semibold text-[#8c7e85]">Hoje</span></div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">{[{rotulo:"Atendimentos",valor:"06"},{rotulo:"Confirmados",valor:"04"},{rotulo:"Pendentes",valor:"02"}].map((item)=><div key={item.rotulo} className="rounded-2xl bg-[#faf6f3] p-3 sm:p-4"><p className="text-[10px] font-medium text-[#9b8d94] sm:text-xs">{item.rotulo}</p><p className="mt-2 text-2xl font-extrabold tracking-tight text-[#3e303c] sm:text-3xl">{item.valor}</p></div>)}</div>
                <div className="mt-5 space-y-2">
                  {[
                    {hora:"09:00",cliente:"Ana Martins",servico:"Limpeza de pele",status:"Confirmado",cor:"bg-[#e8f5eb] text-[#387454]"},
                    {hora:"10:30",cliente:"Rafael Lima",servico:"Corte masculino",status:"Confirmado",cor:"bg-[#e8f5eb] text-[#387454]"},
                    {hora:"14:00",cliente:"Marina Costa",servico:"Escova e finalização",status:"Pendente",cor:"bg-[#fbefdf] text-[#986b35]"},
                  ].map((item)=><div key={item.hora} className="flex items-center gap-3 rounded-2xl border border-[#f0eae7] bg-white p-3 sm:p-4"><span className="w-12 shrink-0 text-xs font-bold text-[#ab7480]">{item.hora}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-[#3c333b] sm:text-sm">{item.cliente}</p><p className="mt-1 truncate text-[11px] text-[#978993]">{item.servico}</p></div><span className={"hidden rounded-full px-2.5 py-1 text-[10px] font-semibold sm:inline-flex "+item.cor}>{item.status}</span></div>)}
                </div>
              </div>
              <p className="absolute -bottom-3 right-5 rounded-full border border-[#e9dad6] bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[.13em] text-[#a68b94] shadow-sm sm:right-10">Prévia ilustrativa</p>
            </div>
          </div>
        </section>

        <section id="recursos" className="bg-white px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.23em] text-[#b87480]">Tudo se conecta</p><h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-tight tracking-[-.055em] text-[#332733] sm:text-5xl">Mais tempo para o que <span className="font-serif font-normal italic text-[#b87480]">realmente importa.</span></h2></div><p className="max-w-md text-sm leading-7 text-[#817780] sm:text-base">Menos papel, menos desencontros. Sua operação organizada com ferramentas práticas.</p></div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{recursos.map((recurso)=><article key={recurso.numero} className="group rounded-[26px] border border-[#eee8e4] bg-[#fbf8f6] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#dbb8bd] hover:shadow-xl hover:shadow-[#87626f]/10"><div className="flex items-start justify-between"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e5e3] text-[#a55e70]"><Icone tipo={recurso.icone}/></div><span className="text-xs font-semibold text-[#ccb9b7]">{recurso.numero}</span></div><h3 className="mt-8 text-xl font-bold tracking-tight text-[#3d313b]">{recurso.titulo}</h3><p className="mt-3 text-sm leading-7 text-[#887d84]">{recurso.descricao}</p></article>)}</div>
          </div>
        </section>

        <section id="segmentos" className="bg-[#302630] px-5 py-20 text-white sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#dbabb4]">Do seu jeito</p><h2 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-[-.055em] sm:text-5xl">Cada espaço tem seu estilo.<br/><span className="font-serif font-normal italic text-[#e6bcb9]">Uma gestão mais leve.</span></h2></div><p className="max-w-sm text-sm leading-7 text-[#c7b8c4]">Uma mesma rotina de agendamento pode ajudar profissionais de áreas diferentes.</p></div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">{segmentos.map((item,i)=><div key={item.titulo} className="rounded-[28px] border border-white/15 bg-white/[.055] p-7 sm:p-8"><div className="flex items-center justify-between"><span className="text-xs font-medium text-[#cda1ad]">0{i+1} / 03</span><span className="text-lg text-[#e6bcb9]">✳</span></div><h3 className="mt-16 text-3xl font-bold tracking-tight">{item.titulo}</h3><p className="mt-3 text-sm leading-6 text-[#cdbdc9]">{item.descricao}</p><p className="mt-7 border-t border-white/15 pt-5 text-xs font-medium text-[#e2b9c2]">{item.exemplos}</p></div>)}</div></div>
        </section>

        <section id="como-funciona" className="bg-[#faf7f4] px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b87480]">Simples desde o início</p><h2 className="mt-4 text-4xl font-extrabold tracking-[-.05em] text-[#332733] sm:text-5xl">Seu espaço em três passos.</h2></div><div className="mt-14 grid gap-8 md:grid-cols-3">{[{n:"01",titulo:"Cadastre seus serviços",descricao:"Defina preços, tempo de atendimento e horários de funcionamento."},{n:"02",titulo:"Compartilhe sua agenda",descricao:"Envie seu link para que os clientes escolham um horário disponível."},{n:"03",titulo:"Acompanhe sua rotina",descricao:"Visualize os atendimentos e cuide do negócio com um painel organizado."}].map((item)=><div key={item.n} className="border-t border-[#d8c5c4] pt-6"><span className="font-serif text-5xl italic text-[#c2909b]">{item.n}</span><h3 className="mt-7 text-xl font-bold text-[#3a2d37]">{item.titulo}</h3><p className="mt-3 max-w-xs text-sm leading-7 text-[#817780]">{item.descricao}</p></div>)}</div></div></section>

        <section id="planos" className="bg-white px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-24"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b87480]">Plano profissional</p><h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-.05em] text-[#332733] sm:text-5xl">Cuidado com o negócio. <span className="font-serif font-normal italic text-[#b87480]">Sem complicação.</span></h2><p className="mt-6 max-w-md text-base leading-8 text-[#817780]">Uma plataforma para organizar a rotina do seu espaço, com uma mensalidade simples.</p></div>
          <div className="rounded-[32px] border border-[#e7d9d8] bg-[#fdfaf9] p-7 shadow-[0_28px_70px_rgba(77,49,63,.09)] sm:p-10"><div className="flex items-center justify-between gap-4"><span className="text-xs font-bold uppercase tracking-[.17em] text-[#a96f7d]">Plano profissional</span><span className="rounded-full bg-[#f6e5e5] px-3 py-1 text-[11px] font-semibold text-[#a25e6d]">7 dias de teste</span></div><div className="mt-8 flex items-baseline gap-2"><span className="text-5xl font-extrabold tracking-[-.07em] text-[#382b35]">R$ 49,90</span><span className="text-sm text-[#9a8a91]">/ mês</span></div><p className="mt-3 text-sm text-[#827680]">Conheça o sistema antes de decidir.</p><div className="my-8 h-px bg-[#eadfdd]"/><ul className="space-y-4 text-sm font-medium text-[#64565f]">{["Agenda e agendamentos online","Gestão de clientes e serviços","Resumo financeiro","Página de agendamento do estabelecimento"].map((item)=><li key={item} className="flex items-start gap-3"><span className="font-bold text-[#b87480]">✓</span>{item}</li>)}</ul><Link href="/cadastro" className="mt-9 flex w-full items-center justify-center rounded-2xl bg-[#332733] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#594354]">Começar meu teste <span className="ml-2" aria-hidden="true">↗</span></Link><p className="mt-4 text-center text-xs text-[#9b8b91]">Consulte as condições do plano no cadastro.</p></div>
          </div>
        </section>

        <section className="bg-[#f3e7e4] px-5 py-20 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#a56772]">Chegou a sua vez</p><h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-[-.05em] text-[#3f303b] sm:text-4xl">Deixe a gestão mais leve.<br/>O atendimento continua sendo seu brilho.</h2></div><Link href="/cadastro" className="inline-flex items-center justify-center rounded-2xl bg-[#332733] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#56404f]">Criar minha conta <span className="ml-3" aria-hidden="true">↗</span></Link></div></section>
      </main>
      <footer className="border-t border-[#ece4df] bg-[#faf7f4] px-5 py-9 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center text-xs text-[#94868c] md:flex-row md:text-left"><p>© {new Date().getFullYear()} BarberSaaS Studio. Feito para quem cuida.</p><div className="flex items-center gap-6"><a href="https://wa.me/5571982839538" target="_blank" rel="noopener noreferrer" className="hover:text-[#a36576]">Falar conosco</a><Link href="/login" className="hover:text-[#a36576]">Área do cliente</Link></div></div></footer>
    </div>
  );
}
