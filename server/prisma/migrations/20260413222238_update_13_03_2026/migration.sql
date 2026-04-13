/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Usuario" (
    "idUsuario" SERIAL NOT NULL,
    "nomeUsuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "Equipe" (
    "idEquipe" SERIAL NOT NULL,
    "nomeEquipe" TEXT NOT NULL,

    CONSTRAINT "Equipe_pkey" PRIMARY KEY ("idEquipe")
);

-- CreateTable
CREATE TABLE "LiderEquipe" (
    "idLiderEquipe" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idEquipe" INTEGER NOT NULL,
    "nomeUsuario" TEXT NOT NULL,

    CONSTRAINT "LiderEquipe_pkey" PRIMARY KEY ("idLiderEquipe")
);

-- CreateTable
CREATE TABLE "Vendedor" (
    "idVendedor" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idEquipe" INTEGER NOT NULL,
    "idLiderEquipe" INTEGER NOT NULL,
    "nomeUsuario" TEXT NOT NULL,

    CONSTRAINT "Vendedor_pkey" PRIMARY KEY ("idVendedor")
);

-- CreateTable
CREATE TABLE "OrigemLead" (
    "idOrigem" SERIAL NOT NULL,
    "nomeOrigem" TEXT NOT NULL,

    CONSTRAINT "OrigemLead_pkey" PRIMARY KEY ("idOrigem")
);

-- CreateTable
CREATE TABLE "Carro" (
    "idCarro" SERIAL NOT NULL,
    "vinChassi" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anoFabricacao" INTEGER NOT NULL,
    "valorEstoque" DOUBLE PRECISION NOT NULL,
    "cor" TEXT NOT NULL,

    CONSTRAINT "Carro_pkey" PRIMARY KEY ("idCarro")
);

-- CreateTable
CREATE TABLE "Lead" (
    "idLead" SERIAL NOT NULL,
    "idVendedor" INTEGER NOT NULL,
    "idOrigem" INTEGER NOT NULL,
    "idCarro" INTEGER NOT NULL,
    "statusLead" TEXT NOT NULL,
    "nomeLead" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("idLead")
);

-- CreateTable
CREATE TABLE "Venda" (
    "idVenda" SERIAL NOT NULL,
    "idLead" INTEGER NOT NULL,
    "idVendedor" INTEGER NOT NULL,
    "idCarro" INTEGER NOT NULL,
    "valorVenda" DOUBLE PRECISION NOT NULL,
    "dataVenda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formaPagamento" TEXT NOT NULL,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("idVenda")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LiderEquipe_idUsuario_key" ON "LiderEquipe"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "LiderEquipe_idEquipe_key" ON "LiderEquipe"("idEquipe");

-- CreateIndex
CREATE UNIQUE INDEX "Vendedor_idUsuario_key" ON "Vendedor"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "Carro_vinChassi_key" ON "Carro"("vinChassi");

-- CreateIndex
CREATE UNIQUE INDEX "Carro_placa_key" ON "Carro"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Venda_idLead_key" ON "Venda"("idLead");

-- AddForeignKey
ALTER TABLE "LiderEquipe" ADD CONSTRAINT "LiderEquipe_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiderEquipe" ADD CONSTRAINT "LiderEquipe_idEquipe_fkey" FOREIGN KEY ("idEquipe") REFERENCES "Equipe"("idEquipe") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendedor" ADD CONSTRAINT "Vendedor_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendedor" ADD CONSTRAINT "Vendedor_idEquipe_fkey" FOREIGN KEY ("idEquipe") REFERENCES "Equipe"("idEquipe") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendedor" ADD CONSTRAINT "Vendedor_idLiderEquipe_fkey" FOREIGN KEY ("idLiderEquipe") REFERENCES "LiderEquipe"("idLiderEquipe") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_idVendedor_fkey" FOREIGN KEY ("idVendedor") REFERENCES "Vendedor"("idVendedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_idOrigem_fkey" FOREIGN KEY ("idOrigem") REFERENCES "OrigemLead"("idOrigem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_idCarro_fkey" FOREIGN KEY ("idCarro") REFERENCES "Carro"("idCarro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_idLead_fkey" FOREIGN KEY ("idLead") REFERENCES "Lead"("idLead") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_idVendedor_fkey" FOREIGN KEY ("idVendedor") REFERENCES "Vendedor"("idVendedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_idCarro_fkey" FOREIGN KEY ("idCarro") REFERENCES "Carro"("idCarro") ON DELETE RESTRICT ON UPDATE CASCADE;
