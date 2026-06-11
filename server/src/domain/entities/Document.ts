export type DocumentType = "File" | "Link";
export type DocumentVisibility = "private" | "public";

export interface DocumentMaterial {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  type: DocumentType;
  url: string | null;
  storedFileName: string | null;
  originalFileName: string | null;
  contentType: string | null;
  sizeBytes: number | null;
  sector: string | null;
  tags: string[];
  isOnboarding: boolean;
  visibility: DocumentVisibility;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}

export interface CreateDocumentInput {
  companyId: string;
  title: string;
  description?: string | null;
  type: DocumentType;
  url?: string | null;
  storedFileName?: string | null;
  originalFileName?: string | null;
  contentType?: string | null;
  sizeBytes?: number | null;
  sector?: string | null;
  tags: string[];
  isOnboarding: boolean;
  visibility: DocumentVisibility;
}

export interface DocumentListFilters {
  companyId: string;
  search?: string;
  sector?: string;
  tag?: string;
  visibility?: DocumentVisibility;
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
