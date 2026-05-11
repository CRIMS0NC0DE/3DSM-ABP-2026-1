import { Prisma, PrismaClient } from "@prisma/client";
import { Permission } from "../domain/entities/Permission";
import { PermissionRepository } from "../domain/repositories/PermissionRepository";

export class PrismaPermissionRepository implements PermissionRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    return permission ? new Permission(permission.id, permission.name) : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { name },
    });
    return permission ? new Permission(permission.id, permission.name) : null;
  }

  async findAll(): Promise<Permission[]> {
    const permissions = await this.prisma.permission.findMany();
    return permissions.map((permission) => new Permission(permission.id, permission.name));
  }

  async create(permission: Permission): Promise<Permission> {
    const createdPermission = await this.prisma.permission.create({
      data: {
        name: permission.name,
      },
    });
    return new Permission(createdPermission.id, createdPermission.name);
  }

  async update(id: string, permission: Partial<Permission>): Promise<Permission | null> {
    const data: Prisma.PermissionUpdateInput = {};
    if (permission.name !== undefined) {
      data.name = permission.name;
    }

    const updatedPermission = await this.prisma.permission.update({
      where: { id },
      data,
    });
    return new Permission(updatedPermission.id, updatedPermission.name);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.permission.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
