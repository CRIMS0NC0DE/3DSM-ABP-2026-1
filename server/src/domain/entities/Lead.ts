export interface Lead {
  id: string;
  clientName: string;
  clientPhone: string | null;
  clientEmail: string | null;
  subject: string | null;
  origin: string;
  importance: "frio" | "morno" | "quente";
  status: string;
  attendantId: string;
  attendantName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadInput {
  clientName: string;
  clientPhone?: string | null;
  clientEmail?: string | null;
  subject?: string | null;
  origin: string;
  importance: "frio" | "morno" | "quente";
  status: string;
  attendantId: string;
}
