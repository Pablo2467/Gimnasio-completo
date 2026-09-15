// auth/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { login as loginRequest } from "../api/auth";
import { setAuthToken } from "../api/client";
import type { Role } from "../types";

const STORAGE_KEY = "gymflow.session";

interface Session {
  token: string;
  role: Role;
}

interface AuthState {
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  login: (email: string, password: string) => Promise<Role>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // Rehidratación: corre una sola vez al montar.
  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Session;
        setSession(parsed);
        setAuthToken(parsed.token);
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsRestoring(false);
  }, []);

  async function login(email: string, password: string) {
    const { accessToken, role } = await loginRequest(email, password);
    const next = { token: accessToken, role };
    setSession(next);
    setAuthToken(accessToken);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return role; // para redirigir según rol (ver A4)
  }

  function logout() {
    setSession(null);
    setAuthToken(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        token: session?.token ?? null,
        role: session?.role ?? null,
        isAuthenticated: !!session,
        isRestoring,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}