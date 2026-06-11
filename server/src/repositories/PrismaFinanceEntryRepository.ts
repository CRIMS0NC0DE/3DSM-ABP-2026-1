import prisma from "../config/db";
import type {
  CreateFinanceEntryInput,
  FinanceEntry,
  FinanceEntryStatus,
  FinanceEntryType,
  FinanceListFilters,
} from "../domain/entities/FinanceEntry";
import type { FinanceEntryRepository } from "../domain/repositories/FinanceEntryRepository";

function toDomain(entry: any): FinanceEntry {
  return {
    id: entry.id,
    companyId: entry.companyId,
    type: entry.type.toLowerCase() as FinanceEntryType,
    status: entry.status.toLowerCase() as FinanceEntryStatus,
    category: entry.category,
    amount: entry.amount.toString(),
    currency: entry.currency,
    notes: entry.notes ?? null,
    attachmentFileName: entry.attachmentFileName ?? null,
    costCenter: entry.costCenter ?? null,
    dueDate: entry.dueDate,
    paidDate: entry.paidDate ?? null,
    occurredAtUtc: entry.occurredAtUtc,
    leadId: entry.leadId ?? null,
    createdAtUtc: entry.createdAtUtc,
    updatedAtUtc: entry.updatedAtUtc,
  };
}

export class PrismaFinanceEntryRepository implements FinanceEntryRepository {
  async findMany(filters: FinanceListFilters) {
    const where: any = { companyId: filters.companyId };
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status.toUpperCase();
    if (filters.dateFrom || filters.dateTo) {
      where.dueDate = {};
      if (filters.dateFrom) where.dueDate.gte = filters.dateFrom;
      if (filters.dateTo) where.dueDate.lte = filters.dateTo;
    }

    const [entries, total] = await Promise.all([
      prisma.financeEntry.findMany({
        where,
        orderBy: { dueDate: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      prisma.financeEntry.count({ where }),
    ]);

    return {
      data: entries.map(toDomain),
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
      },
    };
  }

  async create(input: CreateFinanceEntryInput): Promise<FinanceEntry> {
    const entry = await prisma.financeEntry.create({
      data: {
        companyId: input.companyId,
        type: input.type as any,
        status: (input.status ?? "pending").toUpperCase() as any,
        category: input.category,
        amount: input.amount,
        currency: input.currency,
        dueDate: input.dueDate,
        occurredAtUtc: input.occurredAtUtc ?? input.dueDate,
        paidDate: input.paidDate ?? null,
        costCenter: input.costCenter ?? null,
        notes: input.notes ?? null,
        attachmentFileName: input.attachmentFileName ?? null,
        leadId: input.leadId ?? null,
      },
    });
    return toDomain(entry);
  }

  async findById(companyId: string, id: string): Promise<FinanceEntry | null> {
    const entry = await prisma.financeEntry.findFirst({ where: { id, companyId } });
    return entry ? toDomain(entry) : null;
  }

  async delete(companyId: string, id: string): Promise<void> {
    await prisma.financeEntry.deleteMany({ where: { id, companyId } });
  }
}
