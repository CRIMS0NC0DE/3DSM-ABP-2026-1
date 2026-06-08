import { PermissionRepository } from "../domain/repositories/PermissionRepository";
import { Permission } from "../domain/entities/Permission";
import { AppError } from "../errors/AppError";

export class PermissionService {
  constructor(private permissionRepository: PermissionRepository) {}

  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.findAll();
  }

  async getPermissionById(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new AppError("Permission não encontrada", 404);
    }
    return permission;
  }

  async getPermissionByName(name: string): Promise<Permission> {
    const permission = await this.permissionRepository.findByName(name);
    if (!permission) {
      throw new AppError("Permission não encontrada", 404);
    }
    return permission;
  }

  async createPermission(name: string): Promise<Permission> {
    const existingPermission = await this.permissionRepository.findByName(name);
    if (existingPermission) {
      throw new AppError("Permission com este nome já existe", 409);
    }

    const permission = new Permission("", name);
    return this.permissionRepository.create(permission);
  }

  async updatePermission(id: string, name: string): Promise<Permission> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new AppError("Permission não encontrada", 404);
    }

    if (name !== permission.name) {
      const existingPermission = await this.permissionRepository.findByName(name);
      if (existingPermission) {
        throw new AppError("Permission com este nome já existe", 409);
      }
    }

    const updatedPermission = await this.permissionRepository.update(id, { name });
    if (!updatedPermission) {
      throw new AppError("Erro ao atualizar permission", 500);
    }
    return updatedPermission;
  }

  async deletePermission(id: string): Promise<void> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new AppError("Permission não encontrada", 404);
    }

    const success = await this.permissionRepository.delete(id);
    if (!success) {
      throw new AppError("Erro ao deletar permission", 500);
    }
  }
}
