import type { Prisma } from "@prisma/client";

import prisma from "../config/db";
import type { CreateUserInput, UpdateUserInput, User, UserRole } from "../domain/entities/User";
import type { UserRepository } from "../domain/repositories/UserRepository";
import { AppError } from "../errors/AppError";

type PrismaUserWithRole = Prisma.UserGetPayload<{
  include: {
    role: true;
  };
}>;

function toDomain(user: PrismaUserWithRole): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    roleId: user.roleId,
    role: user.role.name as UserRole,
    teamId: user.teamId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function getRoleId(roleName: UserRole): Promise<string> {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
    select: { id: true },
  });

  if (!role) {
    throw new AppError(`Perfil ${roleName} nao cadastrado. Execute o seed do RBAC.`, 500);
  }

  return role.id;
}

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    return user ? toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    return user ? toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: "desc" },
    });

    return users.map(toDomain);
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { password: passwordHash },
    });
  }

  async create(user: CreateUserInput): Promise<User> {
    const roleId = await getRoleId(user.role);
    const data: Prisma.UserCreateInput = {
      name: user.name,
      email: user.email,
      password: user.password,
      role: { connect: { id: roleId } },
    };

    if (user.teamId) {
      data.team = { connect: { id: user.teamId } };
    }

    const createdUser = await prisma.user.create({
      data,
      include: { role: true },
    });

    return toDomain(createdUser);
  }

  async update(id: string, user: UpdateUserInput): Promise<User> {
    const roleId = user.role ? await getRoleId(user.role) : undefined;
    const data: Prisma.UserUpdateInput = {};

    if (user.name !== undefined) {
      data.name = user.name;
    }
    if (user.email !== undefined) {
      data.email = user.email;
    }
    if (user.password !== undefined) {
      data.password = user.password;
    }
    if (roleId !== undefined) {
      data.role = { connect: { id: roleId } };
    }
    if (user.teamId !== undefined) {
      data.team = user.teamId ? { connect: { id: user.teamId } } : { disconnect: true };
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    });

    return toDomain(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
      include: { role: true },
    });
  }
}
