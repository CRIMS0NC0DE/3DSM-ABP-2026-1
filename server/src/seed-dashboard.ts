import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import csv from "csv-parser";
import prisma from "./config/db";

interface DashboardRow {
  lead_id: string;
  team_name: string;
  user_name: string;
  user_email: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_cpf: string;
  source: string;
  subject: string;
  lead_created_at: string;
  first_interaction_at: string;
  negotiation_importance: string;
  negotiation_stage: string;
  negotiation_status: string;
  is_open: string;
  negotiation_created_at: string;
  negotiation_updated_at: string;
  finalization_reason: string;
}

async function importData() {
  const csvFilePath = path.resolve(__dirname, "../../docs/dados_dashboard_ficticios (1).csv");
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`Arquivo CSV não encontrado em: ${csvFilePath}`);
    process.exit(1);
  }

  console.log("Lendo arquivo CSV...");
  const rows: DashboardRow[] = [];
  
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve())
      .on("error", (error) => reject(error));
  });

  console.log(`Foram encontradas ${rows.length} linhas. Iniciando importação...`);

  // Pegar a role de atendente
  const atendenteRole = await prisma.role.findUnique({
    where: { name: "ATENDENTE" },
  });

  if (!atendenteRole) {
    throw new Error("Role 'ATENDENTE' não encontrada. Por favor, rode o seed inicial primeiro.");
  }

  const defaultPassword = await bcrypt.hash("Senha123!", 10);

  // Caches para evitar consultas repetidas
  const teamCache = new Map<string, string>(); // team_name -> team_id
  const userCache = new Map<string, string>(); // user_email -> user_id

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    
    try {
      // 1. Team
      let teamId = teamCache.get(row.team_name);
      if (!teamId) {
        let team = await prisma.team.findUnique({ where: { name: row.team_name } });
        if (!team) {
          team = await prisma.team.create({ data: { name: row.team_name } });
        }
        teamId = team.id;
        teamCache.set(row.team_name, teamId);
      }

      // 2. User
      let userId = userCache.get(row.user_email);
      if (!userId) {
        let user = await prisma.user.findUnique({ where: { email: row.user_email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: row.user_name,
              email: row.user_email,
              password: defaultPassword,
              roleId: atendenteRole.id,
              teamId: teamId,
            },
          });
        }
        userId = user.id;
        userCache.set(row.user_email, userId);
      }

      // 3. Lead
      const leadCreatedAt = new Date(row.lead_created_at);
      const firstInteractionAt = row.first_interaction_at ? new Date(row.first_interaction_at) : null;
      const leadIdStr = String(row.lead_id || Object.values(row)[0]);
      
      const lead = await prisma.lead.upsert({
        where: { externalId: leadIdStr },
        omit: { isArchived: true },
        update: {
          clientName: row.customer_name,
          clientEmail: row.customer_email || null,
          clientPhone: row.customer_phone || null,
          clientCpf: row.customer_cpf || null,
          origin: row.source,
          subject: row.subject || null,
          importance: row.negotiation_importance || "frio",
          status: row.negotiation_status === "Aberto" || row.negotiation_status === "Em negociação" ? "em_atendimento" : (row.negotiation_status === "Finalizado com venda" ? "convertido" : "perdido"),
          firstInteractionAt: firstInteractionAt,
        },
        create: {
          externalId: leadIdStr,
          attendantId: userId,
          clientName: row.customer_name,
          clientEmail: row.customer_email || null,
          clientPhone: row.customer_phone || null,
          clientCpf: row.customer_cpf || null,
          origin: row.source,
          subject: row.subject || null,
          importance: row.negotiation_importance || "frio",
          status: row.negotiation_status === "Aberto" || row.negotiation_status === "Em negociação" ? "em_atendimento" : (row.negotiation_status === "Finalizado com venda" ? "convertido" : "perdido"),
          firstInteractionAt: firstInteractionAt,
          createdAt: leadCreatedAt,
        },
      });

      // 4. Negotiation
      const negotiationCreatedAt = new Date(row.negotiation_created_at);
      const negotiationUpdatedAt = new Date(row.negotiation_updated_at);
      
      await prisma.negotiation.upsert({
        where: { leadId: lead.id },
        update: {
          stage: row.negotiation_stage,
          status: row.negotiation_status === "Finalizado com venda" || row.negotiation_status === "Finalizado sem venda" ? "encerrada" : "aberta",
          importance: row.negotiation_importance,
          reason: row.finalization_reason || null,
          userId: userId,
          updatedAt: negotiationUpdatedAt,
        },
        create: {
          leadId: lead.id,
          stage: row.negotiation_stage,
          status: row.negotiation_status === "Finalizado com venda" || row.negotiation_status === "Finalizado sem venda" ? "encerrada" : "aberta",
          importance: row.negotiation_importance,
          reason: row.finalization_reason || null,
          userId: userId,
          createdAt: negotiationCreatedAt,
          updatedAt: negotiationUpdatedAt,
        },
      });

      if ((i + 1) % 100 === 0) {
        console.log(`Progresso: ${i + 1}/${rows.length} leads processados...`);
      }
    } catch (error) {
      console.error(`Erro ao processar a linha ${i + 1} (Lead ID: ${row.lead_id}):`, error);
    }
  }

  console.log("Importação concluída com sucesso!");
}

importData()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Erro fatal durante a importação:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
