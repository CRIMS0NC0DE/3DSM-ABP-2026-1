export class Team {
  id: string;
  name: string;
  managerId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, name: string, managerId: string) {
    this.id = id;
    this.name = name;
    this.managerId = managerId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
