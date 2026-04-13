import type { User } from "../entities/User";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  updatePasswordHash(id: number, passwordHash: string): Promise<void>;
  create(user: Omit<User, "id">): Promise<User>;
}

