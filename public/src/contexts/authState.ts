import { createContext } from "react";

import { ApiError } from "../services/api";
import type { AuthUser } from "../types/auth";

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
}

export interface StoredSession {
  token: string;
  user: AuthUser;
}

export const AUTH_STORAGE_KEY = "crm-auth-session";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function readStoredSession(): StoredSession | null {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as StoredSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel autenticar. Tente novamente.";
}
