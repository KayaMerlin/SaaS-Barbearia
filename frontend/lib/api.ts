import axios from "axios";

export const api = axios.create({
  baseURL: "https://saa-s-barbearia-tau.vercel.app",
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("barbersaas_token")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("barbersaas_token");
        window.location.href = "/login";
      }
    }
    if (error.response?.status === 403 && error.response?.data?.codigo === "ASSINATURA_PENDENTE") {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/dashboard/assinatura")) {
        window.location.href = "/dashboard/assinatura";
        return Promise.reject(error);
      }
    }
    if (error.response?.status === 403 && error.response?.data?.codigo === "NAO_ADMIN") {
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
        window.location.href = "/dashboard";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
