import type { LoginResponse } from "../types/auth";
import type { Collaborator } from "../components/Collaborators/types";
import type { UserRole } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  public readonly status: number;
  public readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      payload = undefined;
    }

    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String(payload.message)
        : "Nao foi possivel concluir a requisicao.";

    throw new ApiError(message, response.status, payload);
  }

  return response.json() as Promise<T>;
}

export function login(email: string, senha: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

export function register(nome: string, email: string, senha: string) {
  return request<LoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ nome, email, senha }),
  });
}

export function getCurrentUser(token: string) {
  return request<{ user: LoginResponse["user"] }>("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function listCollaborators(token: string) {
  return request<{ collaborators: Collaborator[] }>("/collaborators", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createCollaborator(
  token: string,
  input: { nome: string; email: string; telefone: string; role: UserRole; senha: string },
) {
  return request<{ collaborator: Collaborator }>("/collaborators", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
}

export function updateCollaborator(
  token: string,
  id: string,
  input: Partial<Pick<Collaborator, "nome" | "telefone" | "role" | "ativo" | "permissoes">>,
) {
  return request<{ collaborator: Collaborator }>(`/collaborators/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
}
