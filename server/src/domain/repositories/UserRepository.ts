import type { CreateUserInput, UpdateUserInput, User } from "../entities/User";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  updatePasswordHash(id: string, passwordHash: string): Promise<void>;
  create(user: CreateUserInput): Promise<User>;
  update(id: string, user: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<void>;
}

