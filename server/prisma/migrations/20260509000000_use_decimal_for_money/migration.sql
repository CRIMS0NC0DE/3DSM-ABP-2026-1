-- Use exact numeric columns for monetary values.
ALTER TABLE "Carro"
ALTER COLUMN "valorEstoque" TYPE DECIMAL(12, 2);

ALTER TABLE "Venda"
ALTER COLUMN "valorVenda" TYPE DECIMAL(12, 2);
