import { z } from "zod";

import type { Lead } from "../domain/entities/Lead";
import type { LeadRepository } from "../domain/repositories/LeadRepository";
import type { UserRepository } from "../domain/repositories/UserRepository";
import { AppError } from "../errors/AppError";
import type { AuthenticatedUser } from "./AuthService";

const createLeadSchema = z.object({
  clientName: z.string().min(1, "Informe o nome do cliente."),
  clientPhone: z.string().optional().nullable(),
  clientEmail: z.string().email().optional().nullable(),
  subject: z.string().optional().nullable(),
  origin: z.string().min(1, "Informe a origem do lead."),
  importance: z.enum(["frio", "morno", "quente"]).default("morno"),
  status: z.string().default("Não atendido"),
});

const updateStatusSchema = z.object({
  status: z.string().min(1),
});

const assignSchema = z.object({
  attendantId: z.string().min(1, "Informe o responsável."),
});

export interface AssignableUser {
  id: string;
  nome: string;
  role: string;
}

export class LeadService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async listLeads(actor: AuthenticatedUser): Promise<Lead[]> {
    if (actor.role === "ADMIN" || actor.role === "GERENTE_GERAL") {
      return this.leadRepository.findAll();
    }

    if (actor.role === "GERENTE") {
      if (!actor.teamId) return [];
      return this.leadRepository.findByTeam(actor.teamId);
    }

    // ATENDENTE: apenas os próprios leads
    return this.leadRepository.findByAttendant(actor.id);
  }

  async createLead(actor: AuthenticatedUser, input: unknown): Promise<Lead> {
    if (actor.role === "GERENTE_GERAL") {
      throw new AppError("Gerente Geral não pode criar leads diretamente.", 403);
    }

    const parsed = createLeadSchema.parse(input);
    return this.leadRepository.create({
      clientName:  parsed.clientName,
      clientPhone: parsed.clientPhone ?? null,
      clientEmail: parsed.clientEmail ?? null,
      subject:     parsed.subject ?? null,
      origin:      parsed.origin,
      importance:  parsed.importance,
      status:      parsed.status,
      attendantId: actor.id,
    });
  }

  async updateStatus(actor: AuthenticatedUser, leadId: string, input: unknown): Promise<Lead> {
    const lead = await this.getLeadOrFail(leadId);
    this.ensureCanActOnLead(actor, lead);

    const { status } = updateStatusSchema.parse(input);
    return this.leadRepository.updateStatus(leadId, status);
  }

  async assignLead(actor: AuthenticatedUser, leadId: string, input: unknown): Promise<Lead> {
    if (actor.role === "ATENDENTE") {
      throw new AppError("Vendedor não pode delegar leads.", 403);
    }

    const lead = await this.getLeadOrFail(leadId);
    const { attendantId } = assignSchema.parse(input);
    const target = await this.userRepository.findById(attendantId);

    if (!target) {
      throw new AppError("Usuário de destino não encontrado.", 404);
    }

    if (actor.role === "GERENTE_GERAL") {
      const allowedRoles = ["GERENTE", "GERENTE_GERAL", "ATENDENTE"];
      if (!allowedRoles.includes(target.role)) {
        throw new AppError("Gerente Geral só pode delegar para Gerentes ou Atendentes.", 403);
      }
    }

    if (actor.role === "GERENTE") {
      if (target.role !== "ATENDENTE" || target.teamId !== actor.teamId) {
        throw new AppError("Gerente só pode atribuir a atendentes do seu time.", 403);
      }
    }

    return this.leadRepository.assign(leadId, attendantId);
  }

  async listAssignable(actor: AuthenticatedUser): Promise<AssignableUser[]> {
    if (actor.role === "ATENDENTE") return [];

    const allUsers = await this.userRepository.findAll();

    if (actor.role === "GERENTE_GERAL") {
      return allUsers
        .filter((u) => ["GERENTE", "GERENTE_GERAL", "ATENDENTE"].includes(u.role) && u.id !== actor.id)
        .map((u) => ({ id: u.id, nome: u.name, role: u.role }));
    }

    if (actor.role === "GERENTE") {
      return allUsers
        .filter((u) => u.role === "ATENDENTE" && u.teamId === actor.teamId)
        .map((u) => ({ id: u.id, nome: u.name, role: u.role }));
    }

    // ADMIN
    return allUsers
      .filter((u) => u.id !== actor.id)
      .map((u) => ({ id: u.id, nome: u.name, role: u.role }));
  }

  private async getLeadOrFail(leadId: string): Promise<Lead> {
    const lead = await this.leadRepository.findById(leadId);
    if (!lead) throw new AppError("Lead não encontrado.", 404);
    return lead;
  }

  private ensureCanActOnLead(actor: AuthenticatedUser, lead: Lead): void {
    if (actor.role === "ADMIN" || actor.role === "GERENTE_GERAL") return;
    if (actor.role === "GERENTE") return;
    if (lead.attendantId !== actor.id) {
      throw new AppError("Você não tem permissão para mover este lead.", 403);
    }
  }
}
