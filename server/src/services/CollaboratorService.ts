import type { Prisma } from "@prisma/client";
import { z } from "zod";

import prisma from "../config/db";
import type { UserRole } from "../domain/entities/User";
import { AppError } from "../errors/AppError";
import type { PasswordHasher } from "../security/password/PasswordHasher";

const USER_ROLES = ["ADMINISTRADOR", "GERENTE_GERAL", "GERENTE", "ATENDENTE", "USUARIO"] as const;

const PERMISSION_KEYS = [
  "dashboard",
  "colaboradores",
  "garagem",
  "leads",
  "notificacoes",
  "configuracoes",
  "detalhes_pagamento",
  "relatorio",
  "transacoes",
  "pontos",
] as const;

type PermissionKey = (typeof PERMISSION_KEYS)[number];
type Permissions = Record<PermissionKey, boolean>;

const permissionsSchema = z
  .object(
    PERMISSION_KEYS.reduce(
      (shape, key) => ({
        ...shape,
        [key]: z.boolean().optional(),
      }),
      {} as Record<PermissionKey, z.ZodOptional<z.ZodBoolean>>,
    ),
  )
  .partial();

const createCollaboratorSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo."),
  email: z.string().email("Informe um e-mail valido."),
  senha: z.string().min(6, "A senha deve ter no minimo 6 caracteres."),
  telefone: z.string().optional().default(""),
  role: z.enum(USER_ROLES).default("USUARIO"),
  permissoes: permissionsSchema.optional(),
});

const updateCollaboratorSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo.").optional(),
  telefone: z.string().optional(),
  role: z.enum(USER_ROLES).optional(),
  ativo: z.boolean().optional(),
  permissoes: permissionsSchema.optional(),
});

type PrismaCollaborator = {
  idUsuario: number;
  nomeUsuario: string;
  email: string;
  telefone: string | null;
  role: string;
  ativo: boolean;
  ultimoLogin: Date | null;
  permissoes: Prisma.JsonValue | null;
};

export interface CollaboratorResponse {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  role: UserRole;
  ativo: boolean;
  lastLoginAt: string | null;
  permissoes: Permissions;
}

export class CollaboratorService {
  constructor(private readonly passwordHasher: PasswordHasher) {}

  async list(): Promise<CollaboratorResponse[]> {
    const collaborators = await prisma.usuario.findMany({
      orderBy: {
        nomeUsuario: "asc",
      },
    });

    return collaborators.map((collaborator) => this.toResponse(collaborator));
  }

  async create(input: unknown): Promise<CollaboratorResponse> {
    const parsed = createCollaboratorSchema.parse(input);
    const normalizedEmail = parsed.email.trim().toLowerCase();

    const existingCollaborator = await prisma.usuario.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingCollaborator) {
      throw new AppError("Ja existe um colaborador cadastrado com esse e-mail.", 409);
    }

    const senhaHash = await this.passwordHasher.hash(parsed.senha);
    const permissions = {
      ...this.buildDefaultPermissions(parsed.role),
      ...(parsed.permissoes ?? {}),
    };

    const collaborator = await prisma.usuario.create({
      data: {
        nomeUsuario: parsed.nome.trim(),
        email: normalizedEmail,
        senha: senhaHash,
        telefone: parsed.telefone.trim(),
        role: parsed.role,
        ativo: true,
        permissoes: permissions,
      },
    });

    return this.toResponse(collaborator);
  }

  async update(id: number, input: unknown): Promise<CollaboratorResponse> {
    if (!Number.isInteger(id)) {
      throw new AppError("Colaborador invalido.", 400);
    }

    const parsed = updateCollaboratorSchema.parse(input);
    const currentCollaborator = await prisma.usuario.findUnique({
      where: { idUsuario: id },
    });

    if (!currentCollaborator) {
      throw new AppError("Colaborador nao encontrado.", 404);
    }

    const nextRole = parsed.role ?? this.toUserRole(currentCollaborator.role);
    const currentPermissions = this.parsePermissions(currentCollaborator.permissoes, nextRole);
    const shouldResetPermissions = Boolean(parsed.role && parsed.role !== currentCollaborator.role && !parsed.permissoes);

    const updateData: Prisma.UsuarioUpdateInput = {
      permissoes: shouldResetPermissions
        ? this.buildDefaultPermissions(nextRole)
        : {
            ...currentPermissions,
            ...(parsed.permissoes ?? {}),
          },
    };

    if (parsed.nome !== undefined) {
      updateData.nomeUsuario = parsed.nome.trim();
    }

    if (parsed.telefone !== undefined) {
      updateData.telefone = parsed.telefone.trim();
    }

    if (parsed.role !== undefined) {
      updateData.role = parsed.role;
    }

    if (parsed.ativo !== undefined) {
      updateData.ativo = parsed.ativo;
    }

    const collaborator = await prisma.usuario.update({
      where: { idUsuario: id },
      data: updateData,
    });

    return this.toResponse(collaborator);
  }

  private toResponse(collaborator: PrismaCollaborator): CollaboratorResponse {
    const role = this.toUserRole(collaborator.role);

    return {
      id: String(collaborator.idUsuario),
      nome: collaborator.nomeUsuario,
      email: collaborator.email,
      telefone: collaborator.telefone ?? "",
      role,
      ativo: collaborator.ativo,
      lastLoginAt: collaborator.ultimoLogin?.toISOString() ?? null,
      permissoes: this.parsePermissions(collaborator.permissoes, role),
    };
  }

  private toUserRole(role: string): UserRole {
    return USER_ROLES.includes(role as UserRole) ? (role as UserRole) : "USUARIO";
  }

  private parsePermissions(value: Prisma.JsonValue | null, role: UserRole): Permissions {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return this.buildDefaultPermissions(role);
    }

    return {
      ...this.buildDefaultPermissions(role),
      ...(value as Partial<Permissions>),
    };
  }

  private buildDefaultPermissions(role: UserRole): Permissions {
    const allEnabled = PERMISSION_KEYS.reduce((permissions, key) => {
      permissions[key] = true;
      return permissions;
    }, {} as Permissions);

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
}
