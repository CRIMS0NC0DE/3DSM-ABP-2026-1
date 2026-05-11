import { Prisma, PrismaClient } from "@prisma/client";
import { Team } from "../domain/entities/Team";
import { TeamRepository } from "../domain/repositories/TeamRepository";

export class PrismaTeamRepository implements TeamRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({
      where: { id },
    });
    if (!team) return null;
    return new Team(team.id, team.name, team.managerId);
  }

  async findByManagerId(managerId: string): Promise<Team[]> {
    const teams = await this.prisma.team.findMany({
      where: { managerId },
    });
    return teams.map((team) => new Team(team.id, team.name, team.managerId));
  }

  async findAll(): Promise<Team[]> {
    const teams = await this.prisma.team.findMany();
    return teams.map((team) => new Team(team.id, team.name, team.managerId));
  }

  async create(team: Team): Promise<Team> {
    const data: Prisma.TeamCreateInput = {
      name: team.name,
    };

    if (team.managerId) {
      data.manager = { connect: { id: team.managerId } };
    }

    const createdTeam = await this.prisma.team.create({
      data,
    });
    return new Team(createdTeam.id, createdTeam.name, createdTeam.managerId);
  }

  async update(id: string, team: Partial<Team>): Promise<Team | null> {
    const data: Prisma.TeamUpdateInput = {};
    if (team.name !== undefined) {
      data.name = team.name;
    }
    if (team.managerId !== undefined) {
      data.manager = team.managerId ? { connect: { id: team.managerId } } : { disconnect: true };
    }

    const updatedTeam = await this.prisma.team.update({
      where: { id },
      data,
    });
    return new Team(updatedTeam.id, updatedTeam.name, updatedTeam.managerId);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.team.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
