import type { CreateLeadInput, Lead } from "../entities/Lead";

export interface LeadRepository {
  findAll(): Promise<Lead[]>;
  findByAttendant(attendantId: string): Promise<Lead[]>;
  findByTeam(teamId: string): Promise<Lead[]>;
  findById(id: string): Promise<Lead | null>;
  create(input: CreateLeadInput): Promise<Lead>;
  updateStatus(id: string, status: string): Promise<Lead>;
  assign(id: string, attendantId: string): Promise<Lead>;
}
