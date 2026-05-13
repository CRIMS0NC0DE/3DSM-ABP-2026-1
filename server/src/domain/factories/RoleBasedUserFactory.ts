import type { User } from "../entities/User";
import { UserFactory, type UserCreationInput } from "./UserFactory";

class ExplicitRoleUserFactory extends UserFactory {
  canCreate(input: UserCreationInput): boolean {
    return Boolean(input.explicitRole);
  }

  protected factoryMethod(input: UserCreationInput): User {
    return {
      id: input.id,
      name: input.name,
      email: input.email,
      password: input.passwordHash,
      roleId: "",
      role: input.explicitRole ?? "ATENDENTE",
      teamId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

class GeneralManagerUserFactory extends UserFactory {
  canCreate(input: UserCreationInput): boolean {
    return input.hasGeneralManagerProfile;
  }

  protected factoryMethod(input: UserCreationInput): User {
    return {
      id: input.id,
      name: input.name,
      email: input.email,
      password: input.passwordHash,
      roleId: "",
      role: "GERENTE_GERAL",
      teamId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

class ManagerUserFactory extends UserFactory {
  canCreate(input: UserCreationInput): boolean {
    return input.hasLeaderProfile;
  }

  protected factoryMethod(input: UserCreationInput): User {
    return {
      id: input.id,
      name: input.name,
      email: input.email,
      password: input.passwordHash,
      roleId: "",
      role: "GERENTE",
      teamId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      name: input.name,
      email: input.email,
      password: input.passwordHash,
      roleId: "",
      role: "ATENDENTE",
      teamId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      name: input.name,
      email: input.email,
      password: input.passwordHash,
      roleId: "",
      role: "ATENDENTE",
      teamId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export class RoleBasedUserFactory {
  private readonly factories: UserFactory[];

  constructor(
    factories: UserFactory[] = [
      new ExplicitRoleUserFactory(),
      new GeneralManagerUserFactory(),
      new ManagerUserFactory(),
      new AttendantUserFactory(),
    ],
  ) {
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
