import bcrypt from "bcrypt";

import type { PasswordHasher } from "./PasswordHasher";

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 10);
  }

  async compare(plainPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
  }
}

