import { PrismaClient } from "@prisma/client";
import { LeadService } from "./src/services/LeadService";

async function main() {
  const service = new LeadService();
  try {
    const ctx = { userId: "test", role: "GERENTE", teamId: "team1" };
    // This will probably not pass findUnique, but let's see.
    console.log("Instantiated LeadService");
  } catch (e) {
    console.error(e);
  }
}
main();
