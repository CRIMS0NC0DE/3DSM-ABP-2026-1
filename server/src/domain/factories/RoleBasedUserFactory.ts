import type { User } from "../entities/User";
import { UserFactory, type UserCreationInput } from "./UserFactory";

class ManagerUserFactory extends UserFactory {
  canCreate(input: UserCreationInput): boolean {
    return input.hasLeaderProfile;
  }

  protected factoryMethod(input: UserCreationInput): User {
    return {
      id: input.id,
      nome: input.nome,
      email: input.email,
      senhaHash: input.senhaHash,
      role: "GERENTE",
    };
  }
}

class AttendantUserFactory extends UserFactory {
  canCreate(input: UserCreationInput): boolean {
    return input.hasSellerProfile;
  }

  protected factoryMethod(input: UserCreationInput): User {
    return {
      id: input.id,
      nome: input.nome,
      email: input.email,
      senhaHash: input.senhaHash,
      role: "ATENDENTE",
    };
  }
}

class DefaultUserFactory extends UserFactory {
  canCreate(): boolean {
    return true;
  }

  protected factoryMethod(input: UserCreationInput): User {
    return {
      id: input.id,
      nome: input.nome,
      email: input.email,
      senhaHash: input.senhaHash,
      role: "USUARIO",
    };
  }
}

export class RoleBasedUserFactory {
  private readonly factories: UserFactory[];

  constructor(factories: UserFactory[] = [new ManagerUserFactory(), new AttendantUserFactory()]) {
    this.factories = [...factories, new DefaultUserFactory()];
  }

  create(input: UserCreationInput): User {
    const selectedFactory = this.factories.find((factory) => factory.canCreate(input));

    if (!selectedFactory) {
      throw new Error("Nenhum método de criação de usuário foi encontrado para o perfil informado.");
    }

    return selectedFactory.create(input);
  }
}
