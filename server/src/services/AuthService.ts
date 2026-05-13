import { z } from "zod";

import type { CreateUserInput, User, UserRole } from "../domain/entities/User";
import type { UserRepository } from "../domain/repositories/UserRepository";
import { AppError } from "../errors/AppError";
import type { PasswordHasher } from "../security/password/PasswordHasher";
import type { JwtPayload, TokenService } from "../security/token/TokenService";

const roleSchema = z.enum(["ADMIN", "GERENTE_GERAL", "GERENTE", "ATENDENTE"]);

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  senha: z.string().min(1, "Informe a senha."),
});

const createUserSchema = z.object({
  nome: z.string().min(1, "Informe o nome."),
  email: z.string().email("Informe um e-mail valido."),
  senha: z.string().min(6, "A senha deve ter no minimo 6 caracteres."),
  role: roleSchema.default("ATENDENTE"),
  teamId: z.string().nullable().optional(),
});

const updateUserSchema = z.object({
  nome: z.string().min(1, "Informe o nome.").optional(),
  email: z.string().email("Informe um e-mail valido.").optional(),
  senha: z.string().min(6, "A senha deve ter no minimo 6 caracteres.").optional(),
  role: roleSchema.optional(),
  teamId: z.string().nullable().optional(),
});

const updateOwnCredentialsSchema = z.object({
  email: z.string().email("Informe um e-mail valido.").optional(),
  senhaAtual: z.string().min(1, "Informe a senha atual.").optional(),
  novaSenha: z.string().min(6, "A senha deve ter no minimo 6 caracteres.").optional(),
});

export interface AuthenticatedUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  teamId: string | null;
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

    const passwordMatches = await this.passwordHasher.compare(senha, user.password);

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

  async register(input: unknown): Promise<LoginResponse> {
    const parsed = createUserSchema.parse(input);
    const normalizedEmail = parsed.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new AppError("Esse e-mail ja esta cadastrado.", 409);
    }

    const hashedPassword = await this.passwordHasher.hash(parsed.senha);
    const user = await this.userRepository.create({
      name: parsed.nome,
      email: normalizedEmail,
      password: hashedPassword,
      role: parsed.role,
      teamId: parsed.teamId ?? null,
    });

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

  async createUser(actor: AuthenticatedUser, input: unknown): Promise<AuthenticatedUser> {
    const parsed = createUserSchema.parse(input);
    const normalizedEmail = parsed.email.trim().toLowerCase();

    this.ensureCanManageUser(actor, parsed.role, parsed.teamId ?? null);

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new AppError("Esse e-mail ja esta cadastrado.", 409);
    }

    const hashedPassword = await this.passwordHasher.hash(parsed.senha);
    const user = await this.userRepository.create({
      name: parsed.nome,
      email: normalizedEmail,
      password: hashedPassword,
      role: parsed.role,
      teamId: parsed.teamId ?? null,
    });

    return this.sanitizeUser(user);
  }

  async listUsers(actor: AuthenticatedUser): Promise<AuthenticatedUser[]> {
    const users = await this.userRepository.findAll();

    if (actor.role === "ADMIN") {
      return users.map((user) => this.sanitizeUser(user));
    }

    if (actor.role === "GERENTE") {
      return users
        .filter((user) => user.teamId === actor.teamId && user.role === "ATENDENTE")
        .map((user) => this.sanitizeUser(user));
    }

    throw new AppError("Acesso negado para este perfil.", 403);
  }

  async updateUser(actor: AuthenticatedUser, userId: string, input: unknown): Promise<AuthenticatedUser> {
    const parsed = updateUserSchema.parse(input);
    const targetUser = await this.getUserOrFail(userId);
    const nextRole = parsed.role ?? targetUser.role;
    const nextTeamId = "teamId" in parsed ? parsed.teamId ?? null : targetUser.teamId ?? null;

    this.ensureCanManageUser(actor, nextRole, nextTeamId, targetUser);

    if (parsed.email) {
      const normalizedEmail = parsed.email.trim().toLowerCase();
      const existingUser = await this.userRepository.findByEmail(normalizedEmail);
      if (existingUser && existingUser.id !== userId) {
        throw new AppError("Esse e-mail ja esta cadastrado.", 409);
      }
      parsed.email = normalizedEmail;
    }

    const password = parsed.senha ? await this.passwordHasher.hash(parsed.senha) : undefined;
    const updatedUser = await this.userRepository.update(userId, {
      name: parsed.nome,
      email: parsed.email,
      password,
      role: parsed.role,
      teamId: "teamId" in parsed ? parsed.teamId ?? null : undefined,
    });

    return this.sanitizeUser(updatedUser);
  }

  async deleteUser(actor: AuthenticatedUser, userId: string): Promise<void> {
    const targetUser = await this.getUserOrFail(userId);

    if (actor.id === userId) {
      throw new AppError("Voce nao pode excluir seu proprio usuario.", 400);
    }

    this.ensureCanManageUser(actor, targetUser.role, targetUser.teamId ?? null, targetUser);
    await this.userRepository.delete(userId);
  }

  async updateOwnCredentials(userId: string, input: unknown): Promise<AuthenticatedUser> {
    const parsed = updateOwnCredentialsSchema.parse(input);
    const currentUser = await this.getUserOrFail(userId);

    if (!parsed.email && !parsed.novaSenha) {
      throw new AppError("Informe e-mail ou nova senha para atualizar.", 400);
    }

    if (parsed.email) {
      const normalizedEmail = parsed.email.trim().toLowerCase();
      const existingUser = await this.userRepository.findByEmail(normalizedEmail);
      if (existingUser && existingUser.id !== userId) {
        throw new AppError("Esse e-mail ja esta cadastrado.", 409);
      }
      parsed.email = normalizedEmail;
    }

    let password: string | undefined;
    if (parsed.novaSenha) {
      if (!parsed.senhaAtual) {
        throw new AppError("Informe a senha atual para alterar a senha.", 400);
      }

      const passwordMatches = await this.passwordHasher.compare(parsed.senhaAtual, currentUser.password);
      if (!passwordMatches) {
        throw new AppError("Senha atual invalida.", 401);
      }

      password = await this.passwordHasher.hash(parsed.novaSenha);
    }

    const updatedUser = await this.userRepository.update(userId, {
      email: parsed.email,
      password,
    });

    return this.sanitizeUser(updatedUser);
  }

  async getUserFromTokenSubject(subject: string | undefined): Promise<AuthenticatedUser> {
    if (!subject) {
      throw new AppError("Token invalido.", 401);
    }

    const user = await this.userRepository.findById(subject);

    if (!user) {
      throw new AppError("Usuario autenticado nao encontrado.", 401);
    }

    return this.sanitizeUser(user);
  }

  verifyToken(token: string): JwtPayload {
    return this.tokenService.verify(token);
  }

  private async getUserOrFail(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("Usuario nao encontrado.", 404);
    }
    return user;
  }

  private ensureCanManageUser(
    actor: AuthenticatedUser,
    targetRole: UserRole,
    targetTeamId: string | null,
    existingTarget?: User,
  ): void {
    if (actor.role === "ADMIN") {
      return;
    }

    if (actor.role === "GERENTE") {
      const targetIsOwnTeamAttendant =
        targetRole === "ATENDENTE" && Boolean(actor.teamId) && targetTeamId === actor.teamId;

      if (targetIsOwnTeamAttendant && (!existingTarget || existingTarget.role === "ATENDENTE")) {
        return;
      }
    }

    throw new AppError("Acesso negado para gerenciar este usuario.", 403);
  }

  private sanitizeUser(user: User): AuthenticatedUser {
    return {
      id: user.id,
      nome: user.name,
      email: user.email,
      role: user.role,
      teamId: user.teamId ?? null,
    };
  }
}
