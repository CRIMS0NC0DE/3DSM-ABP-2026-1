-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('novo', 'em_atendimento', 'agendado', 'em_negociacao', 'convertido', 'perdido');

-- AlterTable: adiciona coluna de arquivamento do funil
ALTER TABLE "leads" ADD COLUMN "archive" BOOLEAN NOT NULL DEFAULT false;

-- Converte status de TEXT para o enum LeadStatus preservando os dados existentes
ALTER TABLE "leads" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "leads" ALTER COLUMN "status" TYPE "LeadStatus" USING ("status"::"LeadStatus");
ALTER TABLE "leads" ALTER COLUMN "status" SET DEFAULT 'novo';

-- CreateIndex
CREATE INDEX "leads_archive_idx" ON "leads"("archive");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");
