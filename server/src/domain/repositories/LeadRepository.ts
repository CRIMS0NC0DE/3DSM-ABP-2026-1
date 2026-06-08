import type { CreateLeadInput, UpdateLeadInput, Lead, LeadStatus } from "../entities/Lead";

export interface LeadRepository {
  findAll(): Promise<Lead[]>;
  findByAttendant(attendantId: string): Promise<Lead[]>;
  findByTeam(teamId: string): Promise<Lead[]>;
  findById(id: string): Promise<Lead | null>;
  create(input: CreateLeadInput): Promise<Lead>;
  update(id: string, input: UpdateLeadInput): Promise<Lead>;
  updateStatus(id: string, status: LeadStatus): Promise<Lead>;
  assign(id: string, attendantId: string): Promise<Lead>;
  archiveFinalized(): Promise<{ count: number }>;
  findArchived(scope?: { attendantId?: string; teamId?: string }): Promise<Lead[]>;
  unarchive(id: string): Promise<Lead>;
}
