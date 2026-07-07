const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "vault_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  register: (payload) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),

  listFiles: () => request("/files"),
  uploadFile: (formData) =>
    request("/files/upload", { method: "POST", body: formData }),
  getDownloadUrl: (id) => request(`/files/${id}/download`),
  deleteFile: (id) => request(`/files/${id}`, { method: "DELETE" }),

  smartSearch: (query) =>
    request("/ai/search", { method: "POST", body: JSON.stringify({ query }) }),
  chatWithFiles: (question) =>
    request("/ai/chat", { method: "POST", body: JSON.stringify({ question }) }),
};