import "dotenv/config";
import express from "express";
import prisma from "./config/db";

const app = express();

const port = Number(process.env.PORT) || 3000;

// Garante que a conexão seja criada sob demanda ao iniciar o app
prisma.$connect().catch((error: Error) => {
    console.error("Falha ao conectar no banco:", error);
    process.exit(1);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})
