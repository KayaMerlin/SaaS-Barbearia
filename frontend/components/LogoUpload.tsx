"use client";

import { useRef } from "react";

type LogoUploadProps = {
  currentLogoUrl: string | null;
  onUploadSuccess: (newUrl: string) => void;
  onUploadError: (message: string) => void;
};

export default function LogoUpload({
  currentLogoUrl,
  onUploadSuccess,
  onUploadError,
}: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      onUploadError("O arquivo é muito grande. O tamanho máximo é 2MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64String = reader.result as string;
      onUploadSuccess(base64String);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    reader.onerror = () => {
      onUploadError("Erro ao processar a imagem.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm md:flex-row md:items-start md:p-10">
      <div
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-32 h-32 rounded-full border-4 border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner transition group-hover:border-blue-100">
          {currentLogoUrl ? (
            <img
              src={currentLogoUrl}
              alt="Logo Atual"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <span className="text-5xl">📷</span>
              <span className="text-xs font-semibold uppercase tracking-wider">
                Logo
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-white text-xs font-bold uppercase tracking-wider">
            Trocar
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center text-center md:items-start md:text-left">
        <h4 className="text-lg font-bold text-slate-950 mb-1">
          Logo da Barbearia
        </h4>
        <p className="text-sm text-slate-500 mb-6 max-w-sm">
          A logo será exibida no painel e na página pública de agendamento. Use
          JPG ou PNG (máx. 2MB).
        </p>

        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
          ref={fileInputRef}
          onChange={handleUpload}
        />

        <div className="flex items-center gap-3 mt-auto">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 bg-slate-950 text-white text-sm font-bold rounded-xl hover:bg-black transition shadow-md"
          >
            Selecionar Arquivo
          </button>
          {currentLogoUrl && (
            <button
              type="button"
              onClick={() => onUploadSuccess("")}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition"
            >
              Remover
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
