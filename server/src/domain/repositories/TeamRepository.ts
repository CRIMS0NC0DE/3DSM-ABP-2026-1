import { Team } from "../entities/Team";

export interface TeamRepository {
  findById(id: string): Promise<Team | null>;
  findByManagerId(managerId: string): Promise<Team[]>;
  findAll(): Promise<Team[]>;
  create(team: Team): Promise<Team>;
  update(id: string, team: Partial<Team>): Promise<Team | null>;
  delete(id: string): Promise<boolean>;
}
