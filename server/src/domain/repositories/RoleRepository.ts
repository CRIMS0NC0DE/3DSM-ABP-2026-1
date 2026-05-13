import { Role } from "../entities/Role";

export interface RoleRepository {
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  create(role: Role): Promise<Role>;
  update(id: string, role: Partial<Role>): Promise<Role | null>;
  delete(id: string): Promise<boolean>;
}
