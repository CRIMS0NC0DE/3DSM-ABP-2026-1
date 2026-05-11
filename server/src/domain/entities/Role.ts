export class Role {
  id: string;
  name: string;
  description: string | undefined;

  constructor(id: string, name: string, description?: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static ATENDENTE = "ATENDENTE";
  static GERENTE = "GERENTE";
  static GERENTE_GERAL = "GERENTE_GERAL";
  static ADMIN = "ADMIN";
}
