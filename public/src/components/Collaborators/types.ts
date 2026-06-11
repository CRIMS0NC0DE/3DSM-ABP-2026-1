import type { UserRole } from "../../types/auth";

export type PermissionKey =
  | "dashboard"
  | "colaboradores"
  | "garagem"
  | "leads"
  | "notificacoes"
  | "configuracoes"
  | "detalhes_pagamento"
  | "relatorio"
  | "transacoes"
  | "pontos"
  | "logs"
  | "agenda"
  | "documentos"
  | "financeiro";

export type Collaborator = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  role: UserRole;
  teamId: string | null;
  teamName: string | null;
  ativo: boolean;
  lastLoginAt: string | null;
  permissoes: Record<PermissionKey, boolean>;
};

export const COLLABORATORS_STORAGE_KEY = "crm-collaborators-v1";

export const TEAMS: Array<{ id: string; name: string }> = [
  { id: "team-pa",              name: "Equipe PA" },
  { id: "team-cacapava",        name: "Equipe Caçapava" },
  { id: "team-sjc-cassiopeia",  name: "SJC - Cassiopeia" },
  { id: "team-sjc-base",        name: "SJC - Base" },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN:         "Administrador",
  GERENTE_GERAL: "Gerente Geral",
  GERENTE:       "Gerente",
  ATENDENTE:     "Vendedor",
};

/** Roles that each actor is allowed to assign/create */
export const ASSIGNABLE_ROLES: Record<UserRole, UserRole[]> = {
  ADMIN:         ["ADMIN", "GERENTE_GERAL", "GERENTE", "ATENDENTE"],
  GERENTE_GERAL: ["GERENTE", "ATENDENTE"],
  GERENTE:       ["ATENDENTE"],
  ATENDENTE:     [],
};

export function getVisibleRoles(viewerRole: UserRole): UserRole[] {
  if (viewerRole === "ADMIN")         return ["ADMIN", "GERENTE_GERAL", "GERENTE", "ATENDENTE"];
  if (viewerRole === "GERENTE_GERAL") return ["GERENTE", "ATENDENTE"];
  if (viewerRole === "GERENTE")       return ["ATENDENTE"];
  return [];
}

/** Cargos que cada ator pode excluir — exclusão é exclusiva do ADMIN. */
export const DELETABLE_ROLES: Record<UserRole, UserRole[]> = {
  ADMIN:         ["GERENTE_GERAL", "GERENTE", "ATENDENTE"],
  GERENTE_GERAL: [],
  GERENTE:       [],
  ATENDENTE:     [],
};

/**
 * Regra de exclusão de colaborador:
 * - segue a hierarquia de DELETABLE_ROLES
 * - ninguém pode excluir a si mesmo
 * - GERENTE só exclui dentro da própria equipe
 */
export function canDeleteCollaborator(
  viewer: { role: UserRole; id: string | undefined; teamId: string | null },
  target: Collaborator,
): boolean {
  if (!viewer.id || viewer.id === target.id) return false;
  if (!DELETABLE_ROLES[viewer.role].includes(target.role)) return false;
  if (viewer.role === "GERENTE") return target.teamId === viewer.teamId;
  return true;
}

export function filterCollaboratorsForViewer(
  all: Collaborator[],
  viewerRole: UserRole,
  viewerTeamId: string | null,
): Collaborator[] {
  const visibleRoles = getVisibleRoles(viewerRole);
  return all.filter((c) => {
    if (!visibleRoles.includes(c.role)) return false;
    if (viewerRole === "GERENTE") return c.teamId === viewerTeamId;
    return true;
  });
}

export const MODULES: Array<{ key: PermissionKey; label: string }> = [
  { key: "dashboard",          label: "Dashboard" },
  { key: "colaboradores",      label: "Colaboradores" },
  { key: "leads",              label: "Leads" },
  { key: "garagem",            label: "Garagem" },
  { key: "notificacoes",       label: "Notificações" },
  { key: "relatorio",          label: "Relatório de vendas" },
  { key: "transacoes",         label: "Transações" },
  { key: "detalhes_pagamento", label: "Detalhes pagamento" },
  { key: "pontos",             label: "Pontos" },
  { key: "logs",               label: "Logs de auditoria" },
  { key: "configuracoes",      label: "Configurações" },
  { key: "agenda",             label: "Agenda" },
  { key: "documentos",         label: "Documentos" },
  { key: "financeiro",         label: "Financeiro" },
];

export function buildDefaultPermissoes(role: UserRole): Record<PermissionKey, boolean> {
  const allEnabled = MODULES.reduce(
    (acc, m) => { acc[m.key] = true; return acc; },
    {} as Record<PermissionKey, boolean>,
  );

  if (role === "ADMIN") return allEnabled;

  // Base restrita: itens que nenhum perfil abaixo de ADMIN usa
  const restricted: Partial<Record<PermissionKey, boolean>> = {
    garagem:            false,
    notificacoes:       false,
    detalhes_pagamento: false,
    transacoes:         false,
    pontos:             false,
    logs:               false, // Logs de auditoria: exclusivo do ADMIN
  };

  if (role === "GERENTE_GERAL") {
    // Dashboard, Leads, Colaboradores, Relatório, Chat, Configurações
    return { ...allEnabled, ...restricted };
  }

  if (role === "GERENTE") {
    // Igual ao GG — Colaboradores mostra apenas a equipe deste gerente
    return { ...allEnabled, ...restricted };
  }

  // ATENDENTE: sem Colaboradores e sem Dashboard (landing vai para "Meus Leads")
  return { ...allEnabled, ...restricted, colaboradores: false, dashboard: false };
}

/** Página inicial padrão de cada perfil (usada em redirects e fallback de permissão). */
export function landingPathForRole(role: UserRole): string {
  return buildDefaultPermissoes(role).dashboard ? "/dashboard" : "/leads";
}

export function defaultCollaborators(): Collaborator[] {
  return [
    {
      id: "col-1",
      nome: "Thiago Nunes",
      email: "thiago.nunes@gmail.com",
      telefone: "+55 11 91234-5678",
      role: "ADMIN",
      teamId: null,
      teamName: null,
      ativo: true,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
      permissoes: buildDefaultPermissoes("ADMIN"),
    },
    {
      id: "col-2",
      nome: "Márcio Bueno",
      email: "marcio.bueno@gmail.com",
      telefone: "+55 11 92345-6789",
      role: "GERENTE",
      teamId: "team-pa",
      teamName: "Equipe PA",
      ativo: true,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      permissoes: buildDefaultPermissoes("GERENTE"),
    },
    {
      id: "col-3",
      nome: "Vinícius",
      email: "vinicius@gmail.com",
      telefone: "+55 11 93456-7890",
      role: "ATENDENTE",
      teamId: "team-pa",
      teamName: "Equipe PA",
      ativo: true,
      lastLoginAt: null,
      permissoes: buildDefaultPermissoes("ATENDENTE"),
    },
    {
      id: "col-4",
      nome: "Davi Almeida",
      email: "davi.almeida@hotmail.com",
      telefone: "+55 11 94567-8901",
      role: "ATENDENTE",
      teamId: "team-pa",
      teamName: "Equipe PA",
      ativo: false,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      permissoes: buildDefaultPermissoes("ATENDENTE"),
    },
  ];
}

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function formatRelativeTime(isoString: string | null) {
  if (!isoString) return "Nunca";

  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) return "—";

  const diffMs      = parsed.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const absMinutes  = Math.abs(diffMinutes);

  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

  if (absMinutes < 60) return rtf.format(diffMinutes, "minute");

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");

  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month");

  return rtf.format(Math.round(diffMonths / 12), "year");
}

export function safeReadStoredCollaborators(): Collaborator[] {
  const raw = localStorage.getItem(COLLABORATORS_STORAGE_KEY);
  if (!raw) return defaultCollaborators();

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return defaultCollaborators();
    // Migrate old records that lack teamId/teamName
    return (parsed as Collaborator[]).map((c) => ({
      ...c,
      teamId: c.teamId ?? null,
      teamName: c.teamName ?? null,
    }));
  } catch {
    localStorage.removeItem(COLLABORATORS_STORAGE_KEY);
    return defaultCollaborators();
  }
}
