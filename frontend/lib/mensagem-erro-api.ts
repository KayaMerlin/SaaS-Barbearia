import axios from "axios";

/** Extrai mensagens de erro da API sem recorrer a tipos any. */
export function mensagemErroApi(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const mensagem = error.response?.data?.erro;
    if (typeof mensagem === "string" && mensagem.trim()) return mensagem;
  }
  return fallback;
}
