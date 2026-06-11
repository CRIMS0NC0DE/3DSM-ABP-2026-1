import prisma from "../config/db";
import type { AgendaEvent, AgendaEventFilters, AgendaEventStatus, AgendaEventType, CreateAgendaEventInput, UpdateAgendaEventStatusInput } from "../domain/entities/AgendaEvent";
import type { AgendaEventRepository } from "../domain/repositories/AgendaEventRepository";
import type { PaginatedResult } from "../domain/entities/Document";

function toDomain(row: any): AgendaEvent {
  return {
    id: row.id,
    companyId: row.companyId,
    title: row.title,
    type: row.type as AgendaEventType,
    status: row.status as AgendaEventStatus,
    scheduledAt: row.scheduledAt,
    clientName: row.clientName,
    vehicleName: row.vehicleName ?? null,
    assignedTo: row.assignedTo ?? null,
    notes: row.notes ?? null,
    leadId: row.leadId ?? null,
    createdAtUtc: row.createdAtUtc,
    updatedAtUtc: row.updatedAtUtc,
  };
}

export class PrismaAgendaEventRepository implements AgendaEventRepository {
  async findMany(filters: AgendaEventFilters): Promise<PaginatedResult<AgendaEvent>> {
    const where: any = { companyId: filters.companyId };

    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.dateFrom || filters.dateTo) {
      where.scheduledAt = {};
      if (filters.dateFrom) where.scheduledAt.gte = filters.dateFrom;
      if (filters.dateTo) where.scheduledAt.lte = filters.dateTo;
    }

    const [rows, total] = await Promise.all([
      prisma.agendaEvent.findMany({
        where,
        orderBy: { scheduledAt: "asc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      prisma.agendaEvent.count({ where }),
    ]);

    return {
      data: rows.map(toDomain),
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
      },
    };
  }

  async findById(companyId: string, id: string): Promise<AgendaEvent | null> {
    const row = await prisma.agendaEvent.findFirst({ where: { id, companyId } });
    return row ? toDomain(row) : null;
  }

  async create(input: CreateAgendaEventInput): Promise<AgendaEvent> {
    const row = await prisma.agendaEvent.create({
      data: {
        companyId: input.companyId,
        title: input.title,
        type: input.type,
        scheduledAt: input.scheduledAt,
        clientName: input.clientName,
        vehicleName: input.vehicleName ?? null,
        assignedTo: input.assignedTo ?? null,
        notes: input.notes ?? null,
        leadId: input.leadId ?? null,
      },
    });
    return toDomain(row);
  }

  async updateStatus(companyId: string, id: string, input: UpdateAgendaEventStatusInput): Promise<AgendaEvent> {
    const row = await prisma.agendaEvent.update({
      where: { id },
      data: { status: input.status },
    });
    return toDomain(row);
  }

  async delete(companyId: string, id: string): Promise<void> {
    await prisma.agendaEvent.deleteMany({ where: { id, companyId } });
  }
}
