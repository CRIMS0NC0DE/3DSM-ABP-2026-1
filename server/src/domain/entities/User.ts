export type UserRole = "ADMIN" | "GERENTE_GERAL" | "GERENTE" | "ATENDENTE";

export interface User {
  id: string;
  email: string;
  password: string;
  roleId: string;
  teamId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

