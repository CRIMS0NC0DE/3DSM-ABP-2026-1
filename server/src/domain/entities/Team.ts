export class Team {
  id: string;
  name: string;
  managerId: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, name: string, managerId?: string | null) {
    this.id = id;
    this.name = name;
    this.managerId = managerId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
