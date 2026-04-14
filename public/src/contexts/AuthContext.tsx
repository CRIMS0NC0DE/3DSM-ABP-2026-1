import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { ApiError, getCurrentUser, login as loginRequest, register as registerRequest } from "../services/api";
import type { AuthUser } from "../types/auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
}

interface StoredSession {
  token: string;
  user: AuthUser;
}

const AUTH_STORAGE_KEY = "crm-auth-session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredSession(): StoredSession | null {
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSession = readStoredSession();

    if (!storedSession) {
      setIsLoading(false);
      return;
    }

    startTransition(() => {
      setToken(storedSession.token);
      setUser(storedSession.user);
    });

    void getCurrentUser(storedSession.token)
      .then(({ user: currentUser }) => {
        startTransition(() => {
          setUser(currentUser);
          localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
              token: storedSession.token,
              user: currentUser,
            }),
          );
        });
      })
      .catch(() => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        startTransition(() => {
          setToken(null);
          setUser(null);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const value: AuthContextValue = {
    isAuthenticated: Boolean(token && user),
    isLoading,
    token,
    user,
    async login(email: string, senha: string) {
      const response = await loginRequest(email, senha);

      startTransition(() => {
        setToken(response.token);
        setUser(response.user);
      });

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token: response.token,
          user: response.user,
        }),
      );
    },
    async register(nome: string, email: string, senha: string) {
      const response = await registerRequest(nome, email, senha);

      startTransition(() => {
        setToken(response.token);
        setUser(response.user);
      });

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token: response.token,
          user: response.user,
        }),
      );
    },
    logout() {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      startTransition(() => {
        setToken(null);
        setUser(null);
      });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider.");
  }

  return context;
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
