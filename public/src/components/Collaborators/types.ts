import type { UserRole } from "../../types/auth";

export type PermissionKey =
  | "dashboard"
  | "colaboradores"
  | "garagem"
  | "leads"
  | "notificacoes"
  | "configuracoes"
  | "detalhes_pagamento"
  | "transacoes"
  | "pontos";

export type Collaborator = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  role: UserRole;
  ativo: boolean;
  lastLoginAt: string | null;
  permissoes: Record<PermissionKey, boolean>;
};

export const COLLABORATORS_STORAGE_KEY = "crm-collaborators-v1";

export const MODULES: Array<{ key: PermissionKey; label: string }> = [
  { key: "dashboard", label: "Dashboard" },
  { key: "colaboradores", label: "Colaboradores" },
  { key: "leads", label: "Leads" },
  { key: "garagem", label: "Garagem" },
  { key: "notificacoes", label: "Notificações" },
  { key: "transacoes", label: "Transações" },
  { key: "detalhes_pagamento", label: "Detalhes pagamento" },
  { key: "pontos", label: "Pontos" },
  { key: "configuracoes", label: "Configurações" },
];

export function buildDefaultPermissoes(role: UserRole): Record<PermissionKey, boolean> {
  const allEnabled = MODULES.reduce(
    (acc, module) => {
      acc[module.key] = true;
      return acc;
    },
    {} as Record<PermissionKey, boolean>,
  );

  if (role === "ADMINISTRADOR") {
    return allEnabled;
  }

  if (role === "GERENTE_GERAL" || role === "GERENTE") {
    return {
      ...allEnabled,
      configuracoes: false,
      colaboradores: false,
    };
  }

  return {
    ...allEnabled,
    configuracoes: false,
    colaboradores: false,
    detalhes_pagamento: false,
    transacoes: false,
  };
}

export function defaultCollaborators(): Collaborator[] {
  return [
    {
      id: "col-1",
      nome: "Thiago Nunes",
      email: "thiago.nunes@gmail.com",
      telefone: "+55 11 91234-5678",
      role: "ADMINISTRADOR",
      ativo: true,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
      permissoes: buildDefaultPermissoes("ADMINISTRADOR"),
    },
    {
      id: "col-2",
      nome: "Márcio Bueno",
      email: "marcio.bueno@gmail.com",
      telefone: "+55 11 92345-6789",
      role: "GERENTE",
      ativo: true,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      permissoes: buildDefaultPermissoes("GERENTE"),
    },
    {
      id: "col-3",
      nome: "Vinícius",
      email: "vinicius@gmail.com",
      telefone: "+55 11 93456-7890",
      role: "USUARIO",
      ativo: true,
      lastLoginAt: null,
      permissoes: buildDefaultPermissoes("USUARIO"),
    },
    {
      id: "col-4",
      nome: "Davi Almeida",
      email: "davi.almeida@hotmail.com",
      telefone: "+55 11 94567-8901",
      role: "ATENDENTE",
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

  const diffMs = parsed.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const absMinutes = Math.abs(diffMinutes);

  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

  if (absMinutes < 60) {
    return rtf.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30) {
    return rtf.format(diffDays, "day");
  }

  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) {
    return rtf.format(diffMonths, "month");
  }

  const diffYears = Math.round(diffMonths / 12);
  return rtf.format(diffYears, "year");
}

export function safeReadStoredCollaborators(): Collaborator[] {
  const raw = localStorage.getItem(COLLABORATORS_STORAGE_KEY);
  if (!raw) return defaultCollaborators();

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return defaultCollaborators();
    return parsed as Collaborator[];
  } catch {
    localStorage.removeItem(COLLABORATORS_STORAGE_KEY);
    return defaultCollaborators();
  }
}

