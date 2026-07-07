import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Only bother checking the session if we actually have a stored token —
    // otherwise every first visit fires a doomed 401 request.
    if (!getToken()) {
      setChecking(false);
      return;
    }
    api
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setChecking(false));
  }, []);

  async function login(payload) {
    const data = await api.login(payload);
    setToken(data.token);
    setUser(data.user);
  }

  async function register(payload) {
    const data = await api.register(payload);
    setToken(data.token);
    setUser(data.user);
  }

  async function logout() {
    try {
      await api.logout();
    } finally {
      setToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, checking, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

