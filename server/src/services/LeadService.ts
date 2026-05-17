import { Prisma } from "@prisma/client";
import { z } from "zod";
import prisma from "../config/db";
import { AppError } from "../errors/AppError";
import { UserContext } from "../types/auth";

// Schema de validação para movimentação na Pipeline do Front-end (Zod 4)
const updateNegotiationSchema = z.object({
  stage: z.enum(["prospecção", "qualificação", "proposta", "fechamento", "perdido"]),
  status: z.enum(["aberta", "encerrada"]),
  reason: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export class LeadService {
  
  // Lista leads com base na "Cadeia de Acesso"
  async listLeads(ctx: UserContext) {
    const where: Prisma.LeadWhereInput = {};

    // Filtro 1: Atendente visualiza apenas os seus próprios leads
    if (ctx.role === "ATENDENTE") {
      where.attendantId = ctx.userId;
    }

    // Filtro 2: Gerente visualiza leads de toda a sua equipe
    if (ctx.role === "GERENTE") {
      if (!ctx.teamId) {
        return []; // Se o gerente não tem time, não vê nada
      }
      where.attendant = {
        teamId: ctx.teamId
      };
    }

    // Gerente Geral e Admin não recebem filtros restritivos (vêem tudo)

    const leads = await prisma.lead.findMany({
      where,
      include: {
        negotiation: true,
        attendant: {
          select: { name: true, teamId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return leads;
  }

  // Atualiza a Negociação (Move o Card na Pipeline)
  async updatePipelineStatus(leadId: string, input: unknown, ctx: UserContext) {
    const parsedData = updateNegotiationSchema.parse(input);

    // 1. Buscar o Lead e a Negociação atual para validar propriedade e histórico
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        attendant: { select: { teamId: true } },
        negotiation: true,
      },
    });

    if (!lead) throw new AppError("Lead não encontrado.", 404);
    if (!lead.negotiation) throw new AppError("Este lead não possui uma negociação ativa.", 400);

    // 2. Validação de Propriedade (Edição por tipo de usuário)
    const isOwner = lead.attendantId === ctx.userId;
    const isManagerOfTeam = ctx.role === "GERENTE" && lead.attendant?.teamId === ctx.teamId;
    const isHigherLevel = ["ADMIN", "GERENTE_GERAL"].includes(ctx.role);

    if (!isOwner && !isManagerOfTeam && !isHigherLevel) {
      throw new AppError("Acesso negado. Você não tem permissão para editar a negociação deste lead.", 403);
    }

    // 3. Executar atualização e registrar histórico em Transação
    return prisma.$transaction(async (tx) => {
      const negotiationId = lead.negotiation!.id;
      const currentStage = lead.negotiation!.stage;
      const currentStatus = lead.negotiation!.status;

      // Atualiza a negociação
      const prevNegotiation = lead.negotiation!;

      const updatedNegotiation = await tx.negotiation.update({
        where: { id: negotiationId },
        data: {
          stage: parsedData.stage,
          status: parsedData.status,
          reason: parsedData.reason ?? prevNegotiation.reason ?? null,
          notes: parsedData.notes ?? prevNegotiation.notes,
        }
      });

      // Se houve mudança no kanban/pipeline, gera o log histórico (Business Rule)
      if (currentStage !== parsedData.stage || currentStatus !== parsedData.status) {
        await tx.negotiationHistory.create({
          data: {
            negotiationId: negotiationId,
            previousStage: currentStage,
            newStage: parsedData.stage,
            previousStatus: currentStatus,
            newStatus: parsedData.status,
            reason: parsedData.reason ?? null,
          }
        });
      }

      return updatedNegotiation;
    });
  }
}