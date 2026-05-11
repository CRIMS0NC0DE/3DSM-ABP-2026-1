import type { Prisma } from "@prisma/client";

import prisma from "../config/db";
import type { User, UserRole } from "../domain/entities/User";
import { RoleBasedUserFactory } from "../domain/factories/RoleBasedUserFactory";
import type { UserRepository } from "../domain/repositories/UserRepository";

type PrismaUserWithRelations = Prisma.UsuarioGetPayload<{
  include: {
    gerenteGeral: true;
    liderEquipe: true;
    vendedor: true;
  };
}>;

const userFactory = new RoleBasedUserFactory();
const USER_ROLES: UserRole[] = ["ADMINISTRADOR", "GERENTE_GERAL", "GERENTE", "ATENDENTE", "USUARIO"];

function toUserRole(role: string | null | undefined): UserRole | undefined {
  return USER_ROLES.includes(role as UserRole) ? (role as UserRole) : undefined;
}

function toDomain(user: NonNullable<PrismaUserWithRelations>): User {
  const explicitRole = toUserRole(user.role);

  return userFactory.create({
    id: user.idUsuario,
    nome: user.nomeUsuario,
    email: user.email,
    senhaHash: user.senha,
    ...(explicitRole ? { explicitRole } : {}),
    hasGeneralManagerProfile: Boolean(user.gerenteGeral),
    hasLeaderProfile: Boolean(user.liderEquipe),
    hasSellerProfile: Boolean(user.vendedor),
  });
}

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: {
        gerenteGeral: true,
        liderEquipe: true,
        vendedor: true,
      },
    });

    return user ? toDomain(user) : null;
  }

  async findById(id: number): Promise<User | null> {
    const user = await prisma.usuario.findUnique({
      where: { idUsuario: id },
      include: {
        gerenteGeral: true,
        liderEquipe: true,
        vendedor: true,
      },
    });

    return user ? toDomain(user) : null;
  }

  async updatePasswordHash(id: number, passwordHash: string): Promise<void> {
    await prisma.usuario.update({
      where: { idUsuario: id },
      data: { senha: passwordHash },
    });
  }

  async create(user: Omit<User, "id">): Promise<User> {
    const createdUser = await prisma.usuario.create({
      data: {
        nomeUsuario: user.nome,
        email: user.email,
        senha: user.senhaHash,
        role: user.role,
      },
      include: {
        gerenteGeral: true,
        liderEquipe: true,
        vendedor: true,
      },
    });

    return toDomain(createdUser);
  }
}
