import { RoleRepository } from "../domain/repositories/RoleRepository";
import { Role } from "../domain/entities/Role";
import { AppError } from "../errors/AppError";

export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async getRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new AppError("Role não encontrado", 404);
    }
    return role;
  }

  async getRoleByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new AppError("Role não encontrado", 404);
    }
    return role;
  }

  async createRole(name: string, description?: string): Promise<Role> {
    const existingRole = await this.roleRepository.findByName(name);
    if (existingRole) {
      throw new AppError("Role com este nome já existe", 409);
    }

    const role = new Role("", name, description);
    return this.roleRepository.create(role);
  }

  async updateRole(id: string, name?: string, description?: string): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new AppError("Role não encontrado", 404);
    }

    if (name && name !== role.name) {
      const existingRole = await this.roleRepository.findByName(name);
      if (existingRole) {
        throw new AppError("Role com este nome já existe", 409);
      }
    }

    const updatedRole = await this.roleRepository.update(id, { name, description });
    if (!updatedRole) {
      throw new AppError("Erro ao atualizar role", 500);
    }
    return updatedRole;
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new AppError("Role não encontrado", 404);
    }

    const success = await this.roleRepository.delete(id);
    if (!success) {
      throw new AppError("Erro ao deletar role", 500);
    }
  }
}
