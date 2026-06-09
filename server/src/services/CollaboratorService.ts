import type { Prisma } from "@prisma/client";
import { z } from "zod";

import prisma from "../config/db";
import type { UserRole } from "../domain/entities/User";
import { AppError } from "../errors/AppError";
import type { PasswordHasher } from "../security/password/PasswordHasher";

const USER_ROLES = ["ADMIN", "GERENTE_GERAL", "GERENTE", "ATENDENTE"] as const;

const createCollaboratorSchema = z.object({
  name: z.string().min(3, "Informe o nome completo."),
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(6, "A senha deve ter no minimo 6 caracteres."),
  role: z.enum(USER_ROLES).default("ATENDENTE"),
  teamId: z.string().nullable().optional(),
});

const updateCollaboratorSchema = z.object({
  name: z.string().min(3, "Informe o nome completo.").optional(),
  role: z.enum(USER_ROLES).optional(),
  teamId: z.string().nullable().optional(),
});

type PrismaCollaborator = Prisma.UserGetPayload<{ include: { role: true } }>;

export interface CollaboratorResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string | null;
  createdAt: string;
  updatedAt: string;
}

async function getRoleId(roleName: UserRole): Promise<string> {
  const role = await prisma.role.findUnique({ where: { name: roleName }, select: { id: true } });

  if (!role) {
    throw new AppError(`Perfil ${roleName} nao cadastrado. Execute o seed do RBAC.`, 500);
  }

  return role.id;
}

export class CollaboratorService {
  constructor(private readonly passwordHasher: PasswordHasher) {}

  async list(): Promise<CollaboratorResponse[]> {
    const collaborators = await prisma.user.findMany({ include: { role: true }, orderBy: { name: "asc" } });

    return collaborators.map((c) => this.toResponse(c));
  }

  async create(input: unknown): Promise<CollaboratorResponse> {
    const parsed = createCollaboratorSchema.parse(input);
    const normalizedEmail = parsed.email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) throw new AppError("Ja existe um colaborador cadastrado com esse e-mail.", 409);

    const passwordHash = await this.passwordHasher.hash(parsed.password);
    const roleId = await getRoleId(parsed.role);

    const createData: any = {
      name: parsed.name.trim(),
      email: normalizedEmail,
      password: passwordHash,
      role: { connect: { id: roleId } },
    };

    if (parsed.teamId) {
      createData.team = { connect: { id: parsed.teamId } };
    }

    const collaborator = await prisma.user.create({ data: createData, include: { role: true } });

    return this.toResponse(collaborator);
  }

  async update(id: string, input: unknown): Promise<CollaboratorResponse> {
    const parsed = updateCollaboratorSchema.parse(input);

    const current = await prisma.user.findUnique({ where: { id }, include: { role: true } });
    if (!current) throw new AppError("Colaborador nao encontrado.", 404);

    const data: Prisma.UserUpdateInput = {};

    if (parsed.name !== undefined) data.name = parsed.name.trim();
    if (parsed.teamId !== undefined) data.team = parsed.teamId ? { connect: { id: parsed.teamId } } : { disconnect: true };
    if (parsed.role !== undefined) {
      const roleId = await getRoleId(parsed.role);
      data.role = { connect: { id: roleId } } as any;
    }

    const updated = await prisma.user.update({ where: { id }, data, include: { role: true } });

    return this.toResponse(updated);
  }

  async delete(id: string): Promise<CollaboratorResponse> {
    const current = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        _count: { select: { leads: true } },
      },
    });

    if (!current) throw new AppError("Colaborador nao encontrado.", 404);

    // Lead.attendant tem onDelete: Cascade — excluir um colaborador com leads
    // atribuidos apagaria esses leads. Bloqueamos e pedimos reatribuicao antes.
    if (current._count.leads > 0) {
      throw new AppError(
        "Nao e possivel excluir: o colaborador ainda possui leads atribuidos. Reatribua os leads antes de excluir.",
        409,
      );
    }

    const deletedCollaborator = this.toResponse(current);
    await prisma.user.delete({ where: { id } });
    return deletedCollaborator;
  }

  private toResponse(collaborator: PrismaCollaborator): CollaboratorResponse {
    return {
      id: collaborator.id,
      name: collaborator.name,
      email: collaborator.email,
      role: collaborator.role.name as UserRole,
      teamId: collaborator.teamId ?? null,
      createdAt: collaborator.createdAt.toISOString(),
      updatedAt: collaborator.updatedAt.toISOString(),
    };
  }
}
