/// <reference path="./types/express.d.ts" />
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
import cors from "cors";
import express from "express";

import prisma from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";
import { createRouter } from "./routes";

const app = express();
const port = Number(process.env.PORT) || 3000;

// Origens de dev liberadas: front em Docker (3002) e Vite nativo (5173).
const allowedOrigins = Array.from(
  new Set([
    process.env.FRONTEND_URL || "http://localhost:3002",
    "http://localhost:3002",
    "http://localhost:5173",
  ]),
);

prisma.$connect().catch((error: Error) => {
  console.error("Falha ao conectar no banco:", error);
  process.exit(1);
});

app.use(
  cors({
    // Array faz o pacote cors refletir a origem da requisicao quando permitida.
    // Sem `origin` (curl, health-check) tambem e liberado.
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin nao permitida pelo CORS: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(createRouter());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:3002`);
});
