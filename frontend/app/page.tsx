import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="flex items-center justify-between px-10 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-extrabold tracking-tighter">
          Barber<span className="text-blue-600">SaaS</span>
        </div>
        <nav className="hidden md:flex gap-8 font-medium text-gray-600">
          <Link href="#inicio" className="hover:text-black transition">
            Inicio
          </Link>
          <Link href="#produto" className="hover:text-black transition">
            Produto
          </Link>
          <Link href="#contato" className="hover:text-black transition">
            Contato
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-10 pt-20 pb-32 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2 flex flex-col items-start text-left animar-entrada">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            O seu sistema de <span className="text-blue-600">barbearia</span> começa agora.
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-md">
            Gerencie seus clientes, horários e faturamento em um só lugar. A
            plataforma definitiva para barbeiros modernos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              href="/cadastro"
              className="px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition shadow-lg w-full sm:w-auto text-center"
            >
              Comece agora por R$ 49,90
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-transparent text-black font-bold rounded-lg border-2 border-black hover:bg-gray-100 transition text-center w-full sm:w-auto"
            >
              Já é cadastrado? Login
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center w-full mt-10 md:mt-0">
          <div className="w-full max-w-md h-[400px] bg-gray-100 border-4 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 font-bold shadow-inner">
            <svg
              className="w-16 h-16 mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <span className="text-xl">IMAGEM 1 BARBEIRO</span>
          </div>
        </div>
      </main>
    </div>
  );
}
