export type UserRole = "ADMIN" | "GERENTE_GERAL" | "GERENTE" | "ATENDENTE";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  teamId?: string | null;
}

export interface LoginResponse {
  token: string;
  expiresIn: string;
  user: AuthUser;
}

