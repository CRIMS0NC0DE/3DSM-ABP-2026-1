import type { CreateFinanceEntryInput, FinanceEntry, FinanceListFilters } from "../entities/FinanceEntry";
import type { PaginatedResult } from "../entities/Document";

export interface FinanceEntryRepository {
  findMany(filters: FinanceListFilters): Promise<PaginatedResult<FinanceEntry>>;
  create(input: CreateFinanceEntryInput): Promise<FinanceEntry>;
  delete(companyId: string, id: string): Promise<void>;
  findById(companyId: string, id: string): Promise<FinanceEntry | null>;
}
