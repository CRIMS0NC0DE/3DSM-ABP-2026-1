import type { PasswordHasher } from "./PasswordHasher";

export abstract class PasswordHasherDecorator implements PasswordHasher {
  constructor(protected readonly passwordHasher: PasswordHasher) {}

  hash(plainPassword: string): Promise<string> {
    return this.passwordHasher.hash(plainPassword);
  }

  compare(plainPassword: string, passwordHash: string): Promise<boolean> {
    return this.passwordHasher.compare(plainPassword, passwordHash);
  }
}

