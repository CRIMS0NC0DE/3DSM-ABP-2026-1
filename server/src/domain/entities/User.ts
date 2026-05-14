export type UserRole = "ADMIN" | "GERENTE_GERAL" | "GERENTE" | "ATENDENTE";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  role: UserRole;
  teamId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  teamId?: string | null;
}

export interface UpdateUserInput {
  name?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
  role?: UserRole | undefined;
  teamId?: string | null | undefined;
}

