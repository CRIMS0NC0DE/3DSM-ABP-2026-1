import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

class Database {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      const adapter = new PrismaPg(pool);

      Database.instance = new PrismaClient({
        adapter,
        log: ["query", "error", "warn"], // Opcional: para ver o que acontece no terminal
      });
    }
    return Database.instance;
  }
}

// Exportamos a instância pronta para uso
const prisma = Database.getInstance();

export default prisma;
