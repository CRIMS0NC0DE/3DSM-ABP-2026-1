import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";

import type { User, UserRole } from "../domain/entities/User";
import type { UserRepository } from "../domain/repositories/UserRepository";
import { AppError } from "../errors/AppError";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  senha: z.string().min(1, "Informe a senha."),
});

export interface AuthenticatedUser {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  expiresIn: string;
  user: AuthenticatedUser;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(input: unknown): Promise<LoginResponse> {
    const { email, senha } = loginSchema.parse(input);
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new AppError("Credenciais invalidas.", 401);
    }

    const passwordMatches = await this.ensurePasswordIsValid(user, senha);

    if (!passwordMatches) {
      throw new AppError("Credenciais invalidas.", 401);
    }

    const expiresIn = this.getJwtExpiresIn();
    const token = jwt.sign(this.buildJwtPayload(user), this.getJwtSecret(), {
      subject: String(user.id),
      expiresIn,
    });

    return {
      token,
      expiresIn: String(expiresIn),
      user: this.sanitizeUser(user),
    };
  }

  async getUserFromTokenSubject(subject: string | undefined): Promise<AuthenticatedUser> {
    if (!subject) {
      throw new AppError("Token invalido.", 401);
    }

    const userId = Number(subject);

    if (!Number.isInteger(userId)) {
      throw new AppError("Token invalido.", 401);
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuario autenticado nao encontrado.", 401);
    }

    return this.sanitizeUser(user);
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.getJwtSecret()) as JwtPayload;
  }

  private sanitizeUser(user: User): AuthenticatedUser {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    };
  }

  private buildJwtPayload(user: User): Omit<JwtPayload, "sub"> {
    return {
      email: user.email,
      role: user.role,
    };
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError("JWT_SECRET nao configurado no ambiente.", 500);
    }

    return secret;
  }

  private getJwtExpiresIn(): JwtExpiresIn {
    return (process.env.JWT_EXPIRES_IN || "8h") as JwtExpiresIn;
  }

  private async ensurePasswordIsValid(user: User, plainPassword: string): Promise<boolean> {
    const currentHash = user.senhaHash;
    const looksHashed = currentHash.startsWith("$2");

    if (looksHashed) {
      return bcrypt.compare(plainPassword, currentHash);
    }

    if (currentHash !== plainPassword) {
      return false;
    }

    const newHash = await bcrypt.hash(plainPassword, 10);
    await this.userRepository.updatePasswordHash(user.id, newHash);

    return true;
  }
}
