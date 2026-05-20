import type { CreateLeadInput, UpdateLeadInput, Lead } from "../entities/Lead";

export interface LeadRepository {
  findAll(): Promise<Lead[]>;
  findByAttendant(attendantId: string): Promise<Lead[]>;
  findByTeam(teamId: string): Promise<Lead[]>;
  findById(id: string): Promise<Lead | null>;
  create(input: CreateLeadInput): Promise<Lead>;
  update(id: string, input: UpdateLeadInput): Promise<Lead>;
  updateStatus(id: string, status: string): Promise<Lead>;
  assign(id: string, attendantId: string): Promise<Lead>;
}
