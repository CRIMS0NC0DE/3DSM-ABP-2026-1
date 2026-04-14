import type { Prisma } from "@prisma/client";

import prisma from "../config/db";
import type { User } from "../domain/entities/User";
import { RoleBasedUserFactory } from "../domain/factories/RoleBasedUserFactory";
import type { UserRepository } from "../domain/repositories/UserRepository";

type PrismaUserWithRelations = Prisma.UsuarioGetPayload<{
  include: {
    liderEquipe: true;
    vendedor: true;
  };
}>;

const userFactory = new RoleBasedUserFactory();

function toDomain(user: NonNullable<PrismaUserWithRelations>): User {
  return userFactory.create({
    id: user.idUsuario,
    nome: user.nomeUsuario,
    email: user.email,
    senhaHash: user.senha,
    hasLeaderProfile: Boolean(user.liderEquipe),
    hasSellerProfile: Boolean(user.vendedor),
  });
}

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: {
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
      },
      include: {
        liderEquipe: true,
        vendedor: true,
      },
    });

    return toDomain(createdUser);
  }
}
