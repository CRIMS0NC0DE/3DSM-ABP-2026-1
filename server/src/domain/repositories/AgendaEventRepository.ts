import type { AgendaEvent, AgendaEventFilters, CreateAgendaEventInput, UpdateAgendaEventStatusInput } from "../entities/AgendaEvent";
import type { PaginatedResult } from "../entities/Document";

export interface AgendaEventRepository {
  findMany(filters: AgendaEventFilters): Promise<PaginatedResult<AgendaEvent>>;
  findById(companyId: string, id: string): Promise<AgendaEvent | null>;
  create(input: CreateAgendaEventInput): Promise<AgendaEvent>;
  updateStatus(companyId: string, id: string, input: UpdateAgendaEventStatusInput): Promise<AgendaEvent>;
  delete(companyId: string, id: string): Promise<void>;
}
