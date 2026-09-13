import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const KEY_AUTH = "authSesi";

export const getAuth = () => {
  try {
    const raw = localStorage.getItem(KEY_AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getToken = () => getAuth()?.token || "";

export const simpanAuth = (token, user) => {
  localStorage.setItem(KEY_AUTH, JSON.stringify({ token, user }));
};

export const hapusAuth = () => {
  localStorage.removeItem(KEY_AUTH);
};

export const mapRole = (role) => {
  if (role === "Pimpinan") return "pimpinan";
  if (role === "Pegawai") return "pengguna";
  return "admin";
};

export const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      hapusAuth();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);