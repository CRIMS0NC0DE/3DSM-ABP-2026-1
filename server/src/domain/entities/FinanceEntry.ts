export type FinanceEntryType = "income" | "expense";

export interface FinanceEntry {
  id: string;
  companyId: string;
  occurredAtUtc: Date;
  type: FinanceEntryType;
  category: string;
  amount: string;
  currency: string;
  notes: string | null;
  attachmentFileName: string | null;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}

export interface CreateFinanceEntryInput {
  companyId: string;
  occurredAtUtc: Date;
  type: FinanceEntryType;
  category: string;
  amount: string;
  currency: string;
  notes?: string | null;
  attachmentFileName?: string | null;
}

export interface FinanceListFilters {
  companyId: string;
  page: number;
  pageSize: number;
}
