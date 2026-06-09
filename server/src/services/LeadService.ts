import { z } from "zod";

import type { Lead, LeadStatus } from "../domain/entities/Lead";
import type { UserRole } from "../domain/entities/User";
import type { LeadRepository } from "../domain/repositories/LeadRepository";
import type { UserRepository } from "../domain/repositories/UserRepository";
import { AppError } from "../errors/AppError";
import type { AuthenticatedUser } from "./AuthService";

const LEAD_STATUSES = [
  "novo",
  "em_atendimento",
  "agendado",
  "em_negociacao",
  "convertido",
  "perdido",
] as const;

const IMPORTANCES = ["frio", "morno", "quente"] as const;

const createLeadSchema = z.object({
  clientName: z.string().min(3, "Informe o nome do cliente."),
  clientPhone: z.string().nullable().optional(),
  clientEmail: z.string().email("Informe um e-mail valido.").nullable().optional(),
  subject: z.string().nullable().optional(),
  origin: z.string().min(1, "Informe a origem do lead."),
  importance: z.enum(IMPORTANCES).default("frio"),
  status: z.enum(LEAD_STATUSES).default("novo"),
  attendantId: z.string().optional(),
});

const updateLeadSchema = z.object({
  clientName: z.string().min(3, "Informe o nome do cliente.").optional(),
  clientPhone: z.string().nullable().optional(),
  clientEmail: z.string().email("Informe um e-mail valido.").nullable().optional(),
  subject: z.string().nullable().optional(),
  origin: z.string().min(1).optional(),
  importance: z.enum(IMPORTANCES).optional(),
  status: z.enum(LEAD_STATUSES).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});

const assignSchema = z.object({
  attendantId: z.string().min(1, "Informe o atendente responsavel."),
});

export interface AssignableUser {
  id: string;
  name: string;
  role: UserRole;
}

export class LeadService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // Funil ativo, escopado pelo perfil do ator. Leads arquivados ja sao filtrados no repositorio.
  async listLeads(actor: AuthenticatedUser): Promise<Lead[]> {
    switch (actor.role) {
      case "ADMIN":
      case "GERENTE_GERAL":
        return this.leadRepository.findAll();
      case "GERENTE":
        return actor.teamId
          ? this.leadRepository.findByTeam(actor.teamId)
          : this.leadRepository.findByAttendant(actor.id);
      default:
        return this.leadRepository.findByAttendant(actor.id);
    }
  }

  async createLead(actor: AuthenticatedUser, input: unknown): Promise<Lead> {
    const parsed = createLeadSchema.parse(input);
    const attendantId = parsed.attendantId ?? actor.id;

    await this.ensureAttendantExists(attendantId);

    return this.leadRepository.create({
      clientName: parsed.clientName,
      clientPhone: parsed.clientPhone ?? null,
      clientEmail: parsed.clientEmail ?? null,
      subject: parsed.subject ?? null,
      origin: parsed.origin,
      importance: parsed.importance,
      status: parsed.status,
      attendantId,
    });
  }

  async updateLead(_actor: AuthenticatedUser, leadId: string, input: unknown): Promise<Lead> {
    const parsed = updateLeadSchema.parse(input);
    await this.ensureLeadExists(leadId);
    return this.leadRepository.update(leadId, parsed);
  }

  async updateStatus(_actor: AuthenticatedUser, leadId: string, input: unknown): Promise<Lead> {
    const { status } = updateStatusSchema.parse(input);
    await this.ensureLeadExists(leadId);
    return this.leadRepository.updateStatus(leadId, status as LeadStatus);
  }

  async assignLead(_actor: AuthenticatedUser, leadId: string, input: unknown): Promise<Lead> {
    const { attendantId } = assignSchema.parse(input);
    await this.ensureLeadExists(leadId);
    await this.ensureAttendantExists(attendantId);
    return this.leadRepository.assign(leadId, attendantId);
  }

  async listAssignable(_actor: AuthenticatedUser): Promise<AssignableUser[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => ({ id: user.id, name: user.name, role: user.role }));
  }

  // Move leads finalizados (convertido) ou perdidos para o arquivo, limpando o funil ativo.
  async arquivarLeadsFinalizados(): Promise<{ count: number }> {
    return this.leadRepository.archiveFinalized();
  }

  // Historico de leads arquivados, escopado pelo perfil do ator (mesma regra do funil ativo).
  async listArchived(actor: AuthenticatedUser): Promise<Lead[]> {
    switch (actor.role) {
      case "ADMIN":
      case "GERENTE_GERAL":
        return this.leadRepository.findArchived();
      case "GERENTE":
        return actor.teamId
          ? this.leadRepository.findArchived({ teamId: actor.teamId })
          : this.leadRepository.findArchived({ attendantId: actor.id });
      default:
        return this.leadRepository.findArchived({ attendantId: actor.id });
    }
  }

  // Devolve um lead arquivado ao funil ativo.
  async unarchiveLead(_actor: AuthenticatedUser, leadId: string): Promise<Lead> {
    await this.ensureLeadExists(leadId);
    return this.leadRepository.unarchive(leadId);
  }

  private async ensureLeadExists(leadId: string): Promise<void> {
    const lead = await this.leadRepository.findById(leadId);
    if (!lead) throw new AppError("Lead nao encontrado.", 404);
  }

  private async ensureAttendantExists(attendantId: string): Promise<void> {
    const attendant = await this.userRepository.findById(attendantId);
    if (!attendant) throw new AppError("Atendente responsavel nao encontrado.", 404);
  }
}
