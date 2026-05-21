/**
 * localStorage-backed mock of api.ts — toggle with VITE_USE_MOCK=true.
 * All function signatures match api.ts exactly so callers need no changes.
 */
import type { LoginResponse, AuthUser } from "../types/auth";
import type { ApiLead, AssignableUser } from "./api";
import type { Collaborator } from "../components/Collaborators/types";
import { buildDefaultPermissoes, TEAMS as TEAM_DEFS } from "../components/Collaborators/types";
import csvRaw from "../data/leads.csv?raw";

// ── Teams ────────────────────────────────────────────────────────────────────

const TEAMS: Record<string, { id: string; name: string }> = {
  PA:             { id: "team-pa",             name: "Equipe PA" },
  CACAPAVA:       { id: "team-cacapava",        name: "Equipe Caçapava" },
  SJC_CASSIOPEIA: { id: "team-sjc-cassiopeia",  name: "SJC - Cassiopeia" },
  SJC_BASE:       { id: "team-sjc-base",        name: "SJC - Base" },
};

// ── Static user catalogue ────────────────────────────────────────────────────

interface MockUser extends AuthUser {
  senha: string;
}

const MOCK_USERS: MockUser[] = [
  { id: "user-admin",       nome: "Admin",              email: "admin@empresa.com.br",          senha: "admin123",   role: "ADMIN",         teamId: null },
  { id: "user-gg",          nome: "Gerente Geral",      email: "gg@empresa.com.br",             senha: "gg123",      role: "GERENTE_GERAL", teamId: null },
  // Gerentes
  { id: "gerente-pa",       nome: "Gerente PA",         email: "gerente.pa@empresa.com.br",     senha: "gerente123", role: "GERENTE",       teamId: TEAMS.PA.id },
  { id: "gerente-cacapava", nome: "Gerente Caçapava",   email: "gerente.cacapava@empresa.com.br", senha: "gerente123", role: "GERENTE",    teamId: TEAMS.CACAPAVA.id },
  { id: "gerente-sjc-cassiopeia", nome: "Gerente SJC Cassiopeia", email: "gerente.sjc.cassiopeia@empresa.com.br", senha: "gerente123", role: "GERENTE", teamId: TEAMS.SJC_CASSIOPEIA.id },
  { id: "gerente-sjc-base",      nome: "Gerente SJC Base",       email: "gerente.sjc.base@empresa.com.br",      senha: "gerente123", role: "GERENTE", teamId: TEAMS.SJC_BASE.id },
  // Equipe PA (6 atendentes)
  { id: "consultor-01",  nome: "Consultor 01",  email: "consultor1@empresa.com.br",  senha: "consul123", role: "ATENDENTE", teamId: TEAMS.PA.id },
  { id: "consultor-02",  nome: "Consultor 02",  email: "consultor2@empresa.com.br",  senha: "consul123", role: "ATENDENTE", teamId: TEAMS.PA.id },
  { id: "consultor-04",  nome: "Consultor 04",  email: "consultor4@empresa.com.br",  senha: "consul123", role: "ATENDENTE", teamId: TEAMS.PA.id },
  { id: "consultor-10",  nome: "Consultor 10",  email: "consultor10@empresa.com.br", senha: "consul123", role: "ATENDENTE", teamId: TEAMS.PA.id },
  { id: "consultor-17",  nome: "Consultor 17",  email: "consultor17@empresa.com.br", senha: "consul123", role: "ATENDENTE", teamId: TEAMS.PA.id },
  { id: "consultor-18",  nome: "Consultor 18",  email: "consultor18@empresa.com.br", senha: "consul123", role: "ATENDENTE", teamId: TEAMS.PA.id },
  // Equipe Caçapava (10 atendentes)
  { id: "consultor-03",  nome: "Consultor 03",  email: "consultor3@empresa.com.br",  senha: "consul123", role: "ATENDENTE", teamId: TEAMS.CACAPAVA.id },
  { id: "consultor-06",  nome: "Consultor 06",  email: "consultor6@empresa.com.br",  senha: "consul123", role: "ATENDENTE", teamId: TEAMS.CACAPAVA.id },
  { id: "consultor-07",  nome: "Consultor 07",  email: "consultor7@empresa.com.br",  senha: "consul123", role: "ATENDENTE", teamId: TEAMS.CACAPAVA.id },
  { id: "consultor-08",  nome: "Consultor 08",  email: "consultor8@empresa.com.br",  senha: "consul123", role: "ATENDENTE", teamId: TEAMS.CACAPAVA.id },
  { id: "consultor-09",  nome: "Consultor 09",  email: "consultor9@empresa.com.br",  senha: "consul123", role: "ATENDENTE", teamId: TEAMS.CACAPAVA.id },
  { id: "consultor-12",  nome: "Consultor 12",  email: "consultor12@empresa.com.br", senha: "consul123", role: "ATENDENTE", teamId: TEAMS.CACAPAVA.id },
  { id: "consultor-13",  nome: "Consultor 13",  email: "consultor13@empresa.com.br", senha: "consul123", role: "ATENDENTE", teamId: TEAMS.CACAPAVA.id },
  { id: "consultor-15",  nome: "Consultor 15",  email: "consultor15@empresa.com.br", senha: "consul123", role: "ATENDENTE", teamId: TEAMS.CACAPAVA.id },
  { id: "consultor-19",  nome: "Consultor 19",  email: "consultor19@empresa.com.br", senha: "consul123", role: "ATENDENTE", teamId: TEAMS.CACAPAVA.id },
  { id: "consultor-20",  nome: "Consultor 20",  email: "consultor20@empresa.com.br", senha: "consul123", role: "ATENDENTE", teamId: TEAMS.CACAPAVA.id },
  // SJC - Cassiopeia (2 atendentes)
  { id: "consultor-05",  nome: "Consultor 05",  email: "consultor5@empresa.com.br",  senha: "consul123", role: "ATENDENTE", teamId: TEAMS.SJC_CASSIOPEIA.id },
  { id: "consultor-11",  nome: "Consultor 11",  email: "consultor11@empresa.com.br", senha: "consul123", role: "ATENDENTE", teamId: TEAMS.SJC_CASSIOPEIA.id },
  // SJC - Base (2 atendentes)
  { id: "consultor-14",  nome: "Consultor 14",  email: "consultor14@empresa.com.br", senha: "consul123", role: "ATENDENTE", teamId: TEAMS.SJC_BASE.id },
  { id: "consultor-16",  nome: "Consultor 16",  email: "consultor16@empresa.com.br", senha: "consul123", role: "ATENDENTE", teamId: TEAMS.SJC_BASE.id },
];

// ── CSV → ApiLead conversion ──────────────────────────────────────────────────

function csvEmailToAttendantId(email: string): string {
  const u = MOCK_USERS.find((m) => m.email === email);
  return u?.id ?? `unknown-${email}`;
}

function csvEmailToAttendantName(email: string): string {
  const u = MOCK_USERS.find((m) => m.email === email);
  return u?.nome ?? email;
}

function mapCsvStatus(csvStatus: string, csvStage: string): string {
  switch (csvStatus) {
    case "Em negociação":
      return csvStage === "Aguardando pagamento" ? "Agendado" : "Em negociação";
    case "Finalizado com venda":
      return "Vendido";
    case "Finalizado sem venda":
      return "Perdido";
    case "Aberto":
    default:
      return csvStage === "Contato inicial" ? "Em atendimento" : "Novo";
  }
}

function parseCsv(raw: string): ApiLead[] {
  const lines = raw.trim().split("\n");
  const header = lines[0].split(",");

  const col = (row: string[], name: string) => {
    const idx = header.indexOf(name);
    return idx >= 0 ? (row[idx] ?? "").trim() : "";
  };

  return lines.slice(1).map((line, i) => {
    // Handle commas inside quoted fields (simple split is enough here — no quoted commas in this CSV)
    const row = line.split(",");
    const csvStatus = col(row, "negotiation_status");
    const csvStage  = col(row, "negotiation_stage");
    const userEmail = col(row, "user_email");

    return {
      id:            `lead-${col(row, "lead_id") || String(i + 1)}`,
      clientName:    col(row, "customer_name"),
      clientPhone:   col(row, "customer_phone") || null,
      clientEmail:   col(row, "customer_email") || null,
      subject:       col(row, "subject") || null,
      origin:        col(row, "source"),
      importance:    (col(row, "negotiation_importance") as "frio" | "morno" | "quente") || "frio",
      status:        mapCsvStatus(csvStatus, csvStage),
      attendantId:   csvEmailToAttendantId(userEmail),
      attendantName: csvEmailToAttendantName(userEmail),
      createdAt:     col(row, "lead_created_at"),
      updatedAt:     col(row, "negotiation_updated_at"),
    } satisfies ApiLead;
  });
}

// ── localStorage store ────────────────────────────────────────────────────────

const LS_LEADS_KEY = "mock_leads_v1";

function getLeads(): ApiLead[] {
  try {
    const raw = localStorage.getItem(LS_LEADS_KEY);
    if (raw) return JSON.parse(raw) as ApiLead[];
  } catch {
    // fall through to seed
  }
  const seeded = parseCsv(csvRaw);
  localStorage.setItem(LS_LEADS_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveLeads(leads: ApiLead[]): void {
  localStorage.setItem(LS_LEADS_KEY, JSON.stringify(leads));
}

// ── Dynamic user password store ───────────────────────────────────────────────
// Persists credentials for users created via register() or createCollaborator().

const LS_PASSWORDS_KEY = "mock_passwords_v1";

interface DynamicUser extends MockUser {}

function getDynamicUsers(): DynamicUser[] {
  try {
    const raw = localStorage.getItem(LS_PASSWORDS_KEY);
    return raw ? (JSON.parse(raw) as DynamicUser[]) : [];
  } catch {
    return [];
  }
}

function saveDynamicUser(u: DynamicUser): void {
  const existing = getDynamicUsers().filter((x) => x.id !== u.id && x.email !== u.email);
  const next = [...existing, u];
  try {
    localStorage.setItem(LS_PASSWORDS_KEY, JSON.stringify(next));
  } catch (err) {
    console.error("[mockApi] falha ao salvar credencial em mock_passwords_v1:", err);
    throw new Error("Não foi possível salvar as credenciais no armazenamento local.");
  }
}

function findUser(email: string, senha?: string): MockUser | null {
  const normalizedEmail = email.trim().toLowerCase();

  const staticMatch = MOCK_USERS.find(
    (u) => u.email === normalizedEmail && (senha === undefined || u.senha === senha),
  );
  if (staticMatch) return staticMatch;

  const dynamic = getDynamicUsers();
  return dynamic.find(
    (u) => u.email === normalizedEmail && (senha === undefined || u.senha === senha),
  ) ?? null;
}

// ── Token helpers ─────────────────────────────────────────────────────────────

function makeToken(userId: string): string {
  return btoa(`mock:${userId}`);
}

function resolveToken(token: string): MockUser | null {
  try {
    const decoded = atob(token);
    if (!decoded.startsWith("mock:")) return null;
    const userId = decoded.slice(5);
    // Check static users
    const staticUser = MOCK_USERS.find((u) => u.id === userId);
    if (staticUser) return staticUser;
    // Check dynamic users
    return getDynamicUsers().find((u) => u.id === userId) ?? null;
  } catch {
    return null;
  }
}

// ── Mock delay ────────────────────────────────────────────────────────────────

function delay(ms = 120): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Public API (same signatures as api.ts) ────────────────────────────────────

export async function login(email: string, senha: string): Promise<LoginResponse> {
  await delay();
  const user = findUser(email.trim().toLowerCase(), senha);
  if (!user) throw new Error("Credenciais inválidas.");
  return {
    token: makeToken(user.id),
    expiresIn: "8h",
    user: { id: user.id, nome: user.nome, email: user.email, role: user.role, teamId: user.teamId },
  };
}

export async function register(nome: string, email: string, senha: string): Promise<LoginResponse> {
  await delay();
  const normalizedEmail = email.trim().toLowerCase();
  if (findUser(normalizedEmail)) throw new Error("E-mail já cadastrado.");
  const id = `user-reg-${Date.now()}`;
  const newUser: DynamicUser = { id, nome, email: normalizedEmail, senha, role: "ATENDENTE", teamId: null };
  saveDynamicUser(newUser);
  // Also add to collaborators store
  const cols = getMockCollaborators();
  cols.unshift({
    id,
    nome,
    email,
    telefone: "",
    role: "ATENDENTE",
    teamId: null,
    teamName: null,
    ativo: true,
    lastLoginAt: null,
    permissoes: buildDefaultPermissoes("ATENDENTE"),
  });
  saveMockCollaborators(cols);
  return {
    token: makeToken(id),
    expiresIn: "8h",
    user: { id, nome, email, role: "ATENDENTE", teamId: null },
  };
}

export async function getCurrentUser(token: string): Promise<{ user: LoginResponse["user"] }> {
  await delay();
  const user = resolveToken(token);
  if (!user) throw new Error("Token inválido.");
  return { user: { id: user.id, nome: user.nome, email: user.email, role: user.role, teamId: user.teamId } };
}

export async function listLeads(_token: string): Promise<{ leads: ApiLead[] }> {
  await delay(80);
  return { leads: getLeads() };
}

export async function createLead(
  _token: string,
  input: {
    clientName: string;
    clientPhone?: string | null;
    clientEmail?: string | null;
    subject?: string | null;
    origin: string;
    importance: "frio" | "morno" | "quente";
    status: string;
  },
): Promise<{ lead: ApiLead }> {
  await delay();
  const token = _token;
  const user  = resolveToken(token);
  const now   = new Date().toISOString();
  const lead: ApiLead = {
    id:            `lead-new-${Date.now()}`,
    clientName:    input.clientName,
    clientPhone:   input.clientPhone ?? null,
    clientEmail:   input.clientEmail ?? null,
    subject:       input.subject ?? null,
    origin:        input.origin,
    importance:    input.importance,
    status:        input.status,
    attendantId:   user?.id ?? "user-admin",
    attendantName: user?.nome ?? "Admin",
    createdAt:     now,
    updatedAt:     now,
  };
  const leads = getLeads();
  leads.unshift(lead);
  saveLeads(leads);
  return { lead };
}

export async function updateLeadStatus(
  _token: string,
  leadId: string,
  status: string,
): Promise<{ lead: ApiLead }> {
  await delay();
  const leads = getLeads();
  const idx   = leads.findIndex((l) => l.id === leadId);
  if (idx === -1) throw new Error("Lead não encontrado.");
  const lead = { ...leads[idx], status, updatedAt: new Date().toISOString() } as ApiLead;
  leads[idx] = lead;
  saveLeads(leads);
  return { lead };
}

export async function updateLead(
  _token: string,
  leadId: string,
  input: Partial<Pick<ApiLead, "clientName" | "clientPhone" | "clientEmail" | "subject" | "origin" | "importance" | "status">>,
): Promise<{ lead: ApiLead }> {
  await delay();
  const leads = getLeads();
  const idx   = leads.findIndex((l) => l.id === leadId);
  if (idx === -1) throw new Error("Lead não encontrado.");
  const lead = { ...leads[idx], ...input, updatedAt: new Date().toISOString() } as ApiLead;
  leads[idx] = lead;
  saveLeads(leads);
  return { lead };
}

export async function assignLead(
  _token: string,
  leadId: string,
  attendantId: string,
): Promise<{ lead: ApiLead }> {
  await delay();
  const leads     = getLeads();
  const idx       = leads.findIndex((l) => l.id === leadId);
  if (idx === -1) throw new Error("Lead não encontrado.");
  const attendant =
    getMockCollaborators().find((c) => c.id === attendantId) ??
    MOCK_USERS.find((u) => u.id === attendantId);
  const lead = {
    ...leads[idx],
    attendantId,
    attendantName: attendant?.nome ?? attendantId,
    updatedAt: new Date().toISOString(),
  } as ApiLead;
  leads[idx] = lead;
  saveLeads(leads);
  return { lead };
}

export async function listAssignable(token: string): Promise<{ users: AssignableUser[] }> {
  await delay(60);
  const requester = resolveToken(token);
  const all = getMockCollaborators();
  const filtered = requester?.role === "GERENTE"
    ? all.filter((c) => c.role === "ATENDENTE" && c.ativo && c.teamId === requester.teamId)
    : all.filter((c) => c.role !== "ADMIN" && c.ativo);
  return { users: filtered.map((c) => ({ id: c.id, nome: c.nome, role: c.role })) };
}

/** Wipe localStorage so the seed data is reloaded on next call. */
export function resetMockDb(): void {
  localStorage.removeItem(LS_LEADS_KEY);
  localStorage.removeItem(LS_COLLABORATORS_KEY);
  localStorage.removeItem(LS_PASSWORDS_KEY);
}

// ── Collaborators store ───────────────────────────────────────────────────────

const LS_COLLABORATORS_KEY = "mock_collaborators_v1";

function mockUserToCollaborator(u: MockUser): Collaborator {
  const team = TEAM_DEFS.find((t) => t.id === u.teamId);
  return {
    id:          u.id,
    nome:        u.nome,
    email:       u.email,
    telefone:    "",
    role:        u.role,
    teamId:      u.teamId,
    teamName:    team?.name ?? null,
    ativo:       true,
    lastLoginAt: null,
    permissoes:  buildDefaultPermissoes(u.role),
  };
}

function getMockCollaborators(): Collaborator[] {
  try {
    const raw = localStorage.getItem(LS_COLLABORATORS_KEY);
    if (raw) return JSON.parse(raw) as Collaborator[];
  } catch {
    // fall through to seed
  }
  const seeded = MOCK_USERS.map(mockUserToCollaborator);
  localStorage.setItem(LS_COLLABORATORS_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveMockCollaborators(cols: Collaborator[]): void {
  localStorage.setItem(LS_COLLABORATORS_KEY, JSON.stringify(cols));
}

// ── Collaborator API (same signatures as api.ts) ──────────────────────────────

export async function listCollaborators(_token: string): Promise<{ collaborators: Collaborator[] }> {
  await delay(100);
  return { collaborators: getMockCollaborators() };
}

export async function createCollaborator(
  _token: string,
  input: {
    nome: string;
    email: string;
    telefone: string;
    role: import("../types/auth").UserRole;
    senha: string;
    teamId?: string | null;
  },
): Promise<{ collaborator: Collaborator }> {
  await delay();
  const cols  = getMockCollaborators();
  const team  = TEAM_DEFS.find((t) => t.id === input.teamId);
  const collaborator: Collaborator = {
    id:          `col-${Date.now()}`,
    nome:        input.nome,
    email:       input.email,
    telefone:    input.telefone,
    role:        input.role,
    teamId:      input.teamId ?? null,
    teamName:    team?.name ?? null,
    ativo:       true,
    lastLoginAt: null,
    permissoes:  buildDefaultPermissoes(input.role),
  };
  cols.unshift(collaborator);
  saveMockCollaborators(cols);
  // Save credentials so this user can log in
  saveDynamicUser({ ...collaborator, senha: input.senha });
  return { collaborator };
}

export async function updateCollaborator(
  _token: string,
  id: string,
  input: Partial<Pick<Collaborator, "nome" | "telefone" | "role" | "ativo" | "permissoes" | "teamId" | "teamName">>,
): Promise<{ collaborator: Collaborator }> {
  await delay();
  const cols = getMockCollaborators();
  const idx  = cols.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Colaborador não encontrado.");

  const patch = { ...input } as Partial<Collaborator>;
  if (input.teamId !== undefined) {
    patch.teamName = TEAM_DEFS.find((t) => t.id === input.teamId)?.name ?? null;
  }

  const collaborator = { ...cols[idx], ...patch } as Collaborator;
  cols[idx] = collaborator;
  saveMockCollaborators(cols);
  return { collaborator };
}
