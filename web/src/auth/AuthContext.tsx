import { createContext, useContext, useState, type ReactNode } from "react";
import { login as loginRequest } from "../api/auth";
import { setAuthToken } from "../api/client";
import type { Role } from "../types";

interface AuthState {
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  async function login(email: string, password: string) {
    const { accessToken, role } = await loginRequest(email, password);
    setToken(accessToken);
    setRole(role);
    setAuthToken(accessToken);
  }

  function logout() {
    setToken(null);
    setRole(null);
    setAuthToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, role, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}