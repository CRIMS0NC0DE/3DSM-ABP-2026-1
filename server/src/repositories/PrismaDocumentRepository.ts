import type { Prisma } from "@prisma/client";

import prisma from "../config/db";
import type { CreateDocumentInput, DocumentListFilters, DocumentMaterial } from "../domain/entities/Document";
import type { DocumentRepository } from "../domain/repositories/DocumentRepository";

function parseTags(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function toDomain(document: any): DocumentMaterial {
  return {
    id: document.id,
    companyId: document.companyId,
    title: document.title,
    description: document.description ?? null,
    type: document.type,
    url: document.url ?? null,
    storedFileName: document.storedFileName ?? null,
    originalFileName: document.originalFileName ?? null,
    contentType: document.contentType ?? null,
    sizeBytes: document.sizeBytes ?? null,
    sector: document.sector ?? null,
    tags: parseTags(document.tagsJson),
    isOnboarding: document.isOnboarding,
    visibility: document.visibility,
    createdAtUtc: document.createdAtUtc,
    updatedAtUtc: document.updatedAtUtc,
  };
}

export class PrismaDocumentRepository implements DocumentRepository {
  async findMany(filters: DocumentListFilters) {
    const where: Prisma.DocumentWhereInput = {
      companyId: filters.companyId,
      ...(filters.sector && { sector: { equals: filters.sector, mode: "insensitive" } }),
      ...(filters.visibility && { visibility: filters.visibility }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
          { originalFileName: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
    };

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { createdAtUtc: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      prisma.document.count({ where }),
    ]);

    const tag = filters.tag?.trim().toLowerCase();
    const mapped = documents.map(toDomain).filter((document) => {
      if (!tag) return true;
      return document.tags.some((item) => item.toLowerCase() === tag);
    });

    return {
      data: mapped,
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total: tag ? mapped.length : total,
        totalPages: Math.max(1, Math.ceil((tag ? mapped.length : total) / filters.pageSize)),
      },
    };
  }

  async findById(companyId: string, id: string): Promise<DocumentMaterial | null> {
    const document = await prisma.document.findFirst({ where: { id, companyId } });
    return document ? toDomain(document) : null;
  }

  async create(input: CreateDocumentInput): Promise<DocumentMaterial> {
    const document = await prisma.document.create({
      data: {
        companyId: input.companyId,
        title: input.title,
        description: input.description ?? null,
        type: input.type,
        url: input.url ?? null,
        storedFileName: input.storedFileName ?? null,
        originalFileName: input.originalFileName ?? null,
        contentType: input.contentType ?? null,
        sizeBytes: input.sizeBytes ?? null,
        sector: input.sector ?? null,
        tagsJson: input.tags,
        isOnboarding: input.isOnboarding,
        visibility: input.visibility,
      },
    });
    return toDomain(document);
  }

  async delete(companyId: string, id: string): Promise<void> {
    await prisma.document.delete({ where: { id, companyId } });
  }
}
