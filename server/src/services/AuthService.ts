import { z } from "zod";

import type { User, UserRole } from "../domain/entities/User";
import type { UserRepository } from "../domain/repositories/UserRepository";
import { AppError } from "../errors/AppError";
import type { PasswordHasher } from "../security/password/PasswordHasher";
import type { JwtPayload, TokenService } from "../security/token/TokenService";

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

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

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

    const generatedToken = this.tokenService.generate({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token: generatedToken.token,
      expiresIn: generatedToken.expiresIn,
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
    return this.tokenService.verify(token);
  }

  private sanitizeUser(user: User): AuthenticatedUser {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    };
  }

  private async ensurePasswordIsValid(user: User, plainPassword: string): Promise<boolean> {
    const currentHash = user.senhaHash;
    const looksHashed = currentHash.startsWith("$2");

    if (looksHashed) {
      return this.passwordHasher.compare(plainPassword, currentHash);
    }

    if (currentHash !== plainPassword) {
      return false;
    }

    const newHash = await this.passwordHasher.hash(plainPassword);
    await this.userRepository.updatePasswordHash(user.id, newHash);

    return true;
  }
}
