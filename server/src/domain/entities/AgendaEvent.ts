export type AgendaEventType = "test_drive" | "visit" | "meeting" | "call" | "follow_up" | "delivery";
export type AgendaEventStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface AgendaEvent {
  id: string;
  companyId: string;
  title: string;
  type: AgendaEventType;
  status: AgendaEventStatus;
  scheduledAt: Date;
  clientName: string;
  vehicleName: string | null;
  assignedTo: string | null;
  notes: string | null;
  leadId: string | null;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}

export interface CreateAgendaEventInput {
  companyId: string;
  title: string;
  type: AgendaEventType;
  scheduledAt: Date;
  clientName: string;
  vehicleName?: string | null;
  assignedTo?: string | null;
  notes?: string | null;
  leadId?: string | null;
}

export interface UpdateAgendaEventStatusInput {
  status: AgendaEventStatus;
}

export interface AgendaEventFilters {
  companyId: string;
  page: number;
  pageSize: number;
  dateFrom?: Date;
  dateTo?: Date;
  status?: AgendaEventStatus;
  type?: AgendaEventType;
}
