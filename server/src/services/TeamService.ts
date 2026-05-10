import { TeamRepository } from "../domain/repositories/TeamRepository";
import { Team } from "../domain/entities/Team";
import { AppError } from "../errors/AppError";

export class TeamService {
  constructor(private teamRepository: TeamRepository) {}

  async getAllTeams(): Promise<Team[]> {
    return this.teamRepository.findAll();
  }

  async getTeamById(id: string): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new AppError("Equipe não encontrada", 404);
    }
    return team;
  }

  async getTeamsByManagerId(managerId: string): Promise<Team[]> {
    return this.teamRepository.findByManagerId(managerId);
  }

  async createTeam(name: string, managerId: string): Promise<Team> {
    if (!name || !managerId) {
      throw new AppError("Nome e managerId são obrigatórios", 400);
    }

    const team = new Team("", name, managerId);
    return this.teamRepository.create(team);
  }

  async updateTeam(id: string, name?: string, managerId?: string): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new AppError("Equipe não encontrada", 404);
    }

    const updatedTeam = await this.teamRepository.update(id, { name, managerId });
    if (!updatedTeam) {
      throw new AppError("Erro ao atualizar equipe", 500);
    }
    return updatedTeam;
  }

  async deleteTeam(id: string): Promise<void> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new AppError("Equipe não encontrada", 404);
    }

    const success = await this.teamRepository.delete(id);
    if (!success) {
      throw new AppError("Erro ao deletar equipe", 500);
    }
  }
}
