export type FinanceEntryType = "income" | "expense";
export type FinanceEntryStatus = "pending" | "paid" | "overdue" | "cancelled";

export interface FinanceEntry {
  id: string;
  companyId: string;
  type: FinanceEntryType;
  status: FinanceEntryStatus;
  category: string;
  amount: string;
  currency: string;
  notes: string | null;
  attachmentFileName: string | null;
  costCenter: string | null;
  dueDate: Date;
  paidDate: Date | null;
  occurredAtUtc: Date;
  leadId: string | null;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}

export interface CreateFinanceEntryInput {
  companyId: string;
  type: FinanceEntryType;
  status?: FinanceEntryStatus;
  category: string;
  amount: string;
  currency: string;
  dueDate: Date;
  occurredAtUtc?: Date;
  paidDate?: Date | null;
  costCenter?: string | null;
  notes?: string | null;
  attachmentFileName?: string | null;
  leadId?: string | null;
}

export interface FinanceListFilters {
  companyId: string;
  page: number;
  pageSize: number;
  type?: FinanceEntryType;
  status?: FinanceEntryStatus;
  dateFrom?: Date;
  dateTo?: Date;
}
