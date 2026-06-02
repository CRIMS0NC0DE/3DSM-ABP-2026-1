import type { LoginResponse } from "../types/auth";
import { buildDefaultPermissoes, type Collaborator } from "../components/Collaborators/types";
import type { UserRole } from "../types/auth";
import * as mockApi from "./mockApi";

type ApiCollaboratorRaw = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string | null;
};

function mapCollaborator(raw: ApiCollaboratorRaw): Collaborator {
  return {
    id: raw.id,
    nome: raw.name,
    email: raw.email,
    telefone: "",
    role: raw.role,
    teamId: raw.teamId ?? null,
    teamName: null,
    ativo: true,
    lastLoginAt: null,
    permissoes: buildDefaultPermissoes(raw.role),
  };
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export interface ApiLead {
  id: string;
  clientName: string;
  clientPhone: string | null;
  clientEmail: string | null;
  subject: string | null;
  origin: string;
  importance: "frio" | "morno" | "quente";
  status: string;
  attendantId: string;
  attendantName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignableUser {
  id: string;
  nome: string;
  role: string;
}

/** Tipos de ação registrados na auditoria. */
export type AuditAction =
  | "lead_created"          // captação de lead
  | "lead_status_changed"   // mudança de status
  | "lead_assigned"         // delegação de lead
  | "collaborator_created"  // novo colaborador
  | "collaborator_deleted"  // exclusão de colaborador
  | "role_changed"          // alteração de cargo
  | "permission_changed"    // alteração de permissão
  | "login";                // acesso ao sistema

export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  actorId: string;
  actorName: string;
  actorRole: string;
  /** Alvo da ação (nome do lead, colaborador etc.). */
  target: string;
  /** Descrição legível do que aconteceu. */
  description: string;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const statusAliasesToApi: Record<string, string> = {
  novo: "novo",
  "nao atendido": "novo",
  "em atendimento": "em_atendimento",
  agendado: "agendado",
  "em negociacao": "em_negociacao",
  vendido: "convertido",
  convertido: "convertido",
  perdido: "perdido",
};

const statusAliasesToUi: Record<string, string> = {
  novo: "Novo",
  "em atendimento": "Em atendimento",
  agendado: "Agendado",
  "em negociacao": "Em negociação",
  convertido: "Vendido",
  vendido: "Vendido",
  perdido: "Perdido",
};

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function toApiStatus(value: string): string {
  const key = normalizeText(value);
  return statusAliasesToApi[key] ?? "novo";
}

function toUiStatus(value: string): string {
  const key = normalizeText(value);
  return statusAliasesToUi[key] ?? value;
}

function mapLeadFromApi(lead: ApiLead): ApiLead {
  return {
    ...lead,
    status: toUiStatus(lead.status),
  };
}

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
  if (USE_MOCK) return mockApi.login(email, senha);
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

export function register(nome: string, email: string, senha: string) {
  if (USE_MOCK) return mockApi.register(nome, email, senha);
  return request<LoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ nome, email, senha }),
  });
}

export function getCurrentUser(token: string) {
  if (USE_MOCK) return mockApi.getCurrentUser(token);
  return request<{ user: LoginResponse["user"] }>("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function listCollaborators(token: string): Promise<{ collaborators: Collaborator[] }> {
  if (USE_MOCK) return mockApi.listCollaborators(token);
  const raw = await request<{ collaborators: ApiCollaboratorRaw[] }>("/collaborators", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return { collaborators: raw.collaborators.map(mapCollaborator) };
}

export async function createCollaborator(
  token: string,
  input: { nome: string; email: string; telefone: string; role: UserRole; senha: string; teamId?: string | null },
): Promise<{ collaborator: Collaborator }> {
  if (USE_MOCK) return mockApi.createCollaborator(token, input);
  const raw = await request<{ collaborator: ApiCollaboratorRaw }>("/collaborators", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: input.nome,
      email: input.email,
      password: input.senha,
      role: input.role,
      teamId: input.teamId,
    }),
  });
  return { collaborator: mapCollaborator(raw.collaborator) };
}

export async function updateCollaborator(
  token: string,
  id: string,
  input: Partial<Pick<Collaborator, "nome" | "telefone" | "role" | "ativo" | "permissoes" | "teamId" | "teamName">>,
): Promise<{ collaborator: Collaborator }> {
  if (USE_MOCK) return mockApi.updateCollaborator(token, id, input);
  const raw = await request<{ collaborator: ApiCollaboratorRaw }>(`/collaborators/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      ...(input.nome !== undefined && { name: input.nome }),
      ...(input.role !== undefined && { role: input.role }),
      ...(input.teamId !== undefined && { teamId: input.teamId }),
    }),
  });
  return { collaborator: mapCollaborator(raw.collaborator) };
}

export function deleteCollaborator(token: string, id: string) {
  if (USE_MOCK) return mockApi.deleteCollaborator(token, id);
  return request<{ success: boolean }>(`/collaborators/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function listLeads(token: string) {
  if (USE_MOCK) return mockApi.listLeads(token);
  return request<{ leads: ApiLead[] }>("/leads", {
    headers: { Authorization: `Bearer ${token}` },
  }).then(({ leads }) => ({ leads: leads.map(mapLeadFromApi) }));
}

export function createLead(
  token: string,
  input: {
    clientName: string;
    clientPhone?: string | null;
    clientEmail?: string | null;
    subject?: string | null;
    origin: string;
    importance: "frio" | "morno" | "quente";
    status: string;
  },
) {
  if (USE_MOCK) return mockApi.createLead(token, input);
  const payload = {
    ...input,
    status: toApiStatus(input.status),
  };
  return request<{ lead: ApiLead }>("/leads", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  }).then(({ lead }) => ({ lead: mapLeadFromApi(lead) }));
}

export function updateLeadStatus(token: string, leadId: string, status: string) {
  if (USE_MOCK) return mockApi.updateLeadStatus(token, leadId, status);
  return request<{ lead: ApiLead }>(`/leads/${leadId}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status: toApiStatus(status) }),
  }).then(({ lead }) => ({ lead: mapLeadFromApi(lead) }));
}

export function updateLead(
  token: string,
  leadId: string,
  input: Partial<Pick<ApiLead, "clientName" | "clientPhone" | "clientEmail" | "subject" | "origin" | "importance" | "status">>,
) {
  if (USE_MOCK) return mockApi.updateLead(token, leadId, input);
  const payload = { ...input } as typeof input;
  if (payload.status !== undefined) {
    payload.status = toApiStatus(payload.status);
  }
  return request<{ lead: ApiLead }>(`/leads/${leadId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  }).then(({ lead }) => ({ lead: mapLeadFromApi(lead) }));
}

export function assignLead(token: string, leadId: string, attendantId: string) {
  if (USE_MOCK) return mockApi.assignLead(token, leadId, attendantId);
  return request<{ lead: ApiLead }>(`/leads/${leadId}/assign`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ attendantId }),
  }).then(({ lead }) => ({ lead: mapLeadFromApi(lead) }));
}

export function listAssignable(token: string) {
  if (USE_MOCK) return mockApi.listAssignable(token);
  return request<{ users: AssignableUser[] }>("/leads/assignable", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function listAuditLogs(token: string) {
  if (USE_MOCK) return mockApi.listAuditLogs(token);
  return request<{ logs: AuditLogEntry[] }>("/audit-logs", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
