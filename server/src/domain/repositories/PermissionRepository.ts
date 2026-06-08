import { Permission } from "../entities/Permission";

export interface PermissionRepository {
  findById(id: string): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  create(permission: Permission): Promise<Permission>;
  update(id: string, permission: Partial<Permission>): Promise<Permission | null>;
  delete(id: string): Promise<boolean>;
}
