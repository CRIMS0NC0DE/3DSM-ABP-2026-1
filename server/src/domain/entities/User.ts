export type UserRole = "ADMINISTRADOR" | "GERENTE_GERAL" | "GERENTE" | "ATENDENTE" | "USUARIO";

export interface User {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  role: UserRole;
}

