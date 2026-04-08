import type { UserRole } from "../../domain/entities/User";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface GeneratedToken {
  token: string;
  expiresIn: string;
}

export interface TokenService {
  generate(input: { userId: number; email: string; role: UserRole }): GeneratedToken;
  verify(token: string): JwtPayload;
}

