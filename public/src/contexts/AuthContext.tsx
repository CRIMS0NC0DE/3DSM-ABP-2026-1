import {
  startTransition,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getCurrentUser, login as loginRequest, register as registerRequest } from "../services/api";
import type { AuthUser } from "../types/auth";
import { AUTH_STORAGE_KEY, AuthContext, type AuthContextValue, readStoredSession } from "./authState";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [storedSession] = useState(readStoredSession);
  const [token, setToken] = useState<string | null>(storedSession?.token ?? null);
  const [user, setUser] = useState<AuthUser | null>(storedSession?.user ?? null);
  const [isLoading, setIsLoading] = useState(Boolean(storedSession));

  useEffect(() => {
    if (!storedSession) {
      return;
    }

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
  }, [storedSession]);

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
