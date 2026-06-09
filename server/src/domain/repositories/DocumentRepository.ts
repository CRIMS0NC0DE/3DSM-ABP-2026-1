import type { CreateDocumentInput, DocumentListFilters, DocumentMaterial, PaginatedResult } from "../entities/Document";

export interface DocumentRepository {
  findMany(filters: DocumentListFilters): Promise<PaginatedResult<DocumentMaterial>>;
  findById(companyId: string, id: string): Promise<DocumentMaterial | null>;
  create(input: CreateDocumentInput): Promise<DocumentMaterial>;
  delete(companyId: string, id: string): Promise<void>;
}
