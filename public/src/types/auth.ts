export type UserRole = "ADMINISTRADOR" | "GERENTE_GERAL" | "GERENTE" | "ATENDENTE" | "USUARIO";

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  expiresIn: string;
  user: AuthUser;
}

