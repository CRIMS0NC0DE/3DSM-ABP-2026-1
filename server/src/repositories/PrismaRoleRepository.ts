import { PrismaClient } from "@prisma/client";
import { Role } from "../../domain/entities/Role";
import { RoleRepository } from "../../domain/repositories/RoleRepository";

export class PrismaRoleRepository implements RoleRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    return role ? new Role(role.id, role.name, role.description || undefined) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { name },
    });
    return role ? new Role(role.id, role.name, role.description || undefined) : null;
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany();
    return roles.map((role) => new Role(role.id, role.name, role.description || undefined));
  }

  async create(role: Role): Promise<Role> {
    const createdRole = await this.prisma.role.create({
      data: {
        name: role.name,
        description: role.description,
      },
    });
    return new Role(createdRole.id, createdRole.name, createdRole.description || undefined);
  }

  async update(id: string, role: Partial<Role>): Promise<Role | null> {
    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: {
        name: role.name,
        description: role.description,
      },
    });
    return new Role(updatedRole.id, updatedRole.name, updatedRole.description || undefined);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.role.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
