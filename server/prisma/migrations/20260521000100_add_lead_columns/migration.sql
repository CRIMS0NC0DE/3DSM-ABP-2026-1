-- Add missing lead columns to match the Prisma schema
ALTER TABLE "leads"
ADD COLUMN "clientCpf" TEXT,
ADD COLUMN "subject" TEXT,
ADD COLUMN "firstInteractionAt" TIMESTAMP(3),
ADD COLUMN "externalId" TEXT;

-- Unique external identifier used during CSV imports
CREATE UNIQUE INDEX "leads_externalId_key" ON "leads"("externalId");
