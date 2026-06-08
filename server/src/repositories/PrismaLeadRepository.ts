import prisma from "../config/db";
import type { CreateLeadInput, UpdateLeadInput, Lead, LeadStatus } from "../domain/entities/Lead";
import type { LeadRepository } from "../domain/repositories/LeadRepository";

const include = { attendant: { select: { id: true, name: true } } } as const;

function toDomain(lead: any): Lead {
  return {
    id: lead.id,
    clientName: lead.clientName,
    clientPhone: lead.clientPhone ?? null,
    clientEmail: lead.clientEmail ?? null,
    subject: lead.subject ?? null,
    origin: lead.origin,
    importance: lead.importance as Lead["importance"],
    status: lead.status as LeadStatus,
    attendantId: lead.attendantId,
    attendantName: lead.attendant?.name ?? "Sem responsavel",
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
}

export class PrismaLeadRepository implements LeadRepository {
  async findAll(): Promise<Lead[]> {
    const leads = await prisma.lead.findMany({
      include,
      orderBy: { createdAt: "desc" },
    });
    return leads.map(toDomain);
  }

  async findByAttendant(attendantId: string): Promise<Lead[]> {
    const leads = await prisma.lead.findMany({
      where: { attendantId },
      include,
      orderBy: { createdAt: "desc" },
    });
    return leads.map(toDomain);
  }

  async findByTeam(teamId: string): Promise<Lead[]> {
    const leads = await prisma.lead.findMany({
      where: { attendant: { teamId } },
      include,
      orderBy: { createdAt: "desc" },
    });
    return leads.map(toDomain);
  }

  async findById(id: string): Promise<Lead | null> {
    const lead = await prisma.lead.findUnique({ where: { id }, include });
    return lead ? toDomain(lead) : null;
  }

  async create(input: CreateLeadInput): Promise<Lead> {
    const lead = await prisma.lead.create({
      data: {
        clientName: input.clientName,
        clientPhone: input.clientPhone ?? null,
        clientEmail: input.clientEmail ?? null,
        subject: input.subject ?? null,
        origin: input.origin,
        importance: input.importance,
        status: input.status,
        attendantId: input.attendantId,
      },
      include,
    });
    return toDomain(lead);
  }

  async update(id: string, input: UpdateLeadInput): Promise<Lead> {
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(input.clientName  !== undefined && { clientName:  input.clientName }),
        ...(input.clientPhone !== undefined && { clientPhone: input.clientPhone }),
        ...(input.clientEmail !== undefined && { clientEmail: input.clientEmail }),
        ...(input.subject     !== undefined && { subject:     input.subject }),
        ...(input.origin      !== undefined && { origin:      input.origin }),
        ...(input.importance  !== undefined && { importance:  input.importance }),
        ...(input.status      !== undefined && { status:      input.status }),
      },
      include,
    });
    return toDomain(lead);
  }

  async updateStatus(id: string, status: string): Promise<Lead> {
    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
      include,
    });
    return toDomain(lead);
  }

  async assign(id: string, attendantId: string): Promise<Lead> {
    const lead = await prisma.lead.update({
      where: { id },
      data: { attendantId },
      include,
    });
    return toDomain(lead);
  }
}
