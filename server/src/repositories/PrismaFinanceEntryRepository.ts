import prisma from "../config/db";
import type { CreateFinanceEntryInput, FinanceEntry, FinanceListFilters } from "../domain/entities/FinanceEntry";
import type { FinanceEntryRepository } from "../domain/repositories/FinanceEntryRepository";

function toDomain(entry: any): FinanceEntry {
  return {
    id: entry.id,
    companyId: entry.companyId,
    occurredAtUtc: entry.occurredAtUtc,
    type: entry.type,
    category: entry.category,
    amount: entry.amount.toString(),
    currency: entry.currency,
    notes: entry.notes ?? null,
    attachmentFileName: entry.attachmentFileName ?? null,
    createdAtUtc: entry.createdAtUtc,
    updatedAtUtc: entry.updatedAtUtc,
  };
}

export class PrismaFinanceEntryRepository implements FinanceEntryRepository {
  async findMany(filters: FinanceListFilters) {
    const where = { companyId: filters.companyId };
    const [entries, total] = await Promise.all([
      prisma.financeEntry.findMany({
        where,
        orderBy: { occurredAtUtc: "desc" },
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
        occurredAtUtc: input.occurredAtUtc,
        type: input.type,
        category: input.category,
        amount: input.amount,
        currency: input.currency,
        notes: input.notes ?? null,
        attachmentFileName: input.attachmentFileName ?? null,
      },
    });
    return toDomain(entry);
  }

  async findById(companyId: string, id: string): Promise<FinanceEntry | null> {
    const entry = await prisma.financeEntry.findFirst({ where: { id, companyId } });
    return entry ? toDomain(entry) : null;
  }

  async delete(companyId: string, id: string): Promise<void> {
    await prisma.financeEntry.delete({ where: { id, companyId } });
  }
}
