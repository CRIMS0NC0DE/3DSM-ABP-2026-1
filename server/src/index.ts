/// <reference path="./types/express.d.ts" />
import "dotenv/config";
import cors from "cors";
import express from "express";

import prisma from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";
import { createRouter } from "./routes";

const app = express();
const port = Number(process.env.PORT) || 3000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3002";

prisma.$connect().catch((error: Error) => {
  console.error("Falha ao conectar no banco:", error);
  process.exit(1);
});

app.use(
  cors({
    origin: frontendUrl,
  }),
);
app.use(express.json());
app.use(createRouter());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
