import { z } from "zod";

import type { FinanceEntry } from "../domain/entities/FinanceEntry";
import type { PaginatedResult } from "../domain/entities/Document";
import type { FinanceEntryRepository } from "../domain/repositories/FinanceEntryRepository";
import { AppError } from "../errors/AppError";
import type { AuthenticatedUser } from "./AuthService";
import { resolveCompanyId } from "./tenant";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const createFinanceSchema = z.object({
  occurredAtUtc: z.coerce.date({ error: "Informe a data do lancamento." }),
  type: z.enum(["income", "expense"]),
  category: z.string().trim().min(2, "Informe a categoria."),
  amount: z.coerce.number().positive("Informe um valor maior que zero."),
  currency: z.string().trim().length(3, "Informe uma moeda valida.").default("BRL"),
  notes: z.string().trim().optional().nullable(),
  attachmentFileName: z.string().trim().optional().nullable(),
});

export class FinanceService {
  constructor(private readonly financeRepository: FinanceEntryRepository) {}

  async list(actor: AuthenticatedUser, query: unknown): Promise<PaginatedResult<FinanceEntry>> {
    const parsed = paginationSchema.parse(query);
    return this.financeRepository.findMany({
      companyId: resolveCompanyId(actor),
      page: parsed.page,
      pageSize: parsed.pageSize,
    });
  }

  async create(actor: AuthenticatedUser, input: unknown): Promise<FinanceEntry> {
    const parsed = createFinanceSchema.parse(input);
    return this.financeRepository.create({
      companyId: resolveCompanyId(actor),
      occurredAtUtc: parsed.occurredAtUtc,
      type: parsed.type,
      category: parsed.category,
      amount: parsed.amount.toFixed(2),
      currency: parsed.currency.toUpperCase(),
      notes: parsed.notes ?? null,
      attachmentFileName: parsed.attachmentFileName ?? null,
    });
  }

  async delete(actor: AuthenticatedUser, id: string): Promise<void> {
    const entry = await this.financeRepository.findById(resolveCompanyId(actor), id);
    if (!entry) throw new AppError("Lancamento financeiro nao encontrado.", 404);
    await this.financeRepository.delete(resolveCompanyId(actor), id);
  }
}
