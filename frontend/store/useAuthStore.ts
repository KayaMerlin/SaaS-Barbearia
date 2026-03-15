import { create } from "zustand";

interface Usuario {
  nome: string;
  logoUrl: string | null;
  statusAssinatura: string;
}

interface AuthState {
  usuario: Usuario | null;
  setUsuario: (dados: Usuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,

  setUsuario: (dados) => set({ usuario: dados }),

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("barbersaas_token");
    }
    set({ usuario: null });
  },
}));
