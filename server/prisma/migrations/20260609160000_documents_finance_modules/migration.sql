CREATE TYPE "DocumentType" AS ENUM ('File', 'Link');
CREATE TYPE "DocumentVisibility" AS ENUM ('private', 'public');
CREATE TYPE "FinanceEntryType" AS ENUM ('income', 'expense');

CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "DocumentType" NOT NULL,
    "url" TEXT,
    "storedFileName" TEXT,
    "originalFileName" TEXT,
    "contentType" TEXT,
    "sizeBytes" INTEGER,
    "sector" TEXT,
    "tagsJson" JSONB,
    "isOnboarding" BOOLEAN NOT NULL DEFAULT false,
    "visibility" "DocumentVisibility" NOT NULL DEFAULT 'private',
    "createdAtUtc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAtUtc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "finance_entries" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "occurredAtUtc" TIMESTAMP(3) NOT NULL,
    "type" "FinanceEntryType" NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "notes" TEXT,
    "attachmentFileName" TEXT,
    "createdAtUtc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAtUtc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "documents_companyId_idx" ON "documents"("companyId");
CREATE INDEX "documents_companyId_visibility_idx" ON "documents"("companyId", "visibility");
CREATE INDEX "documents_companyId_sector_idx" ON "documents"("companyId", "sector");
CREATE INDEX "finance_entries_companyId_idx" ON "finance_entries"("companyId");
CREATE INDEX "finance_entries_companyId_occurredAtUtc_idx" ON "finance_entries"("companyId", "occurredAtUtc");
CREATE INDEX "finance_entries_companyId_type_idx" ON "finance_entries"("companyId", "type");
