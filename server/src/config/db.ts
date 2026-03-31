import { PrismaClient } from "@prisma/client";

class Database {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: ["query", "error", "warn"], // Opcional: para ver o que acontece no terminal
      });
    }
    return Database.instance;
  }
}

// Exportamos a instância pronta para uso
export const prisma = Database.getInstance();