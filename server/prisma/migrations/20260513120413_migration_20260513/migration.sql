/*
  Warnings:

  - You are about to drop the `Carro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Equipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LiderEquipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrigemLead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Venda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vendedor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_idCarro_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_idOrigem_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_idVendedor_fkey";

-- DropForeignKey
ALTER TABLE "LiderEquipe" DROP CONSTRAINT "LiderEquipe_idEquipe_fkey";

-- DropForeignKey
ALTER TABLE "LiderEquipe" DROP CONSTRAINT "LiderEquipe_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "Venda" DROP CONSTRAINT "Venda_idCarro_fkey";

-- DropForeignKey
ALTER TABLE "Venda" DROP CONSTRAINT "Venda_idLead_fkey";

-- DropForeignKey
ALTER TABLE "Venda" DROP CONSTRAINT "Venda_idVendedor_fkey";

-- DropForeignKey
ALTER TABLE "Vendedor" DROP CONSTRAINT "Vendedor_idEquipe_fkey";

-- DropForeignKey
ALTER TABLE "Vendedor" DROP CONSTRAINT "Vendedor_idLiderEquipe_fkey";

-- DropForeignKey
ALTER TABLE "Vendedor" DROP CONSTRAINT "Vendedor_idUsuario_fkey";

-- AlterTable
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PermissionToRole_AB_unique";

-- DropTable
DROP TABLE "Carro";

-- DropTable
DROP TABLE "Equipe";

-- DropTable
DROP TABLE "Lead";

-- DropTable
DROP TABLE "LiderEquipe";

-- DropTable
DROP TABLE "OrigemLead";

-- DropTable
DROP TABLE "Usuario";

-- DropTable
DROP TABLE "Venda";

-- DropTable
DROP TABLE "Vendedor";
