import type { User } from "../entities/User";
import type { UserRole } from "../entities/User";

export interface UserCreationInput {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  explicitRole?: UserRole;
  hasGeneralManagerProfile: boolean;
  hasLeaderProfile: boolean;
  hasSellerProfile: boolean;
}

export abstract class UserFactory {
  abstract canCreate(input: UserCreationInput): boolean;

  create(input: UserCreationInput): User {
    return this.factoryMethod(input);
  }

  protected abstract factoryMethod(input: UserCreationInput): User;
}
