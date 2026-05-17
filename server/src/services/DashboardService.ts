import { Prisma } from "@prisma/client";
import prisma from "../config/db";
import { AppError } from "../errors/AppError";
import { UserContext } from "../types/auth";

export class DashboardService {
  async getMetrics(ctx: UserContext, startDateStr?: string, endDateStr?: string) {
    // 1. Definição do Período e Validação (RF06)
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    // Padrão: últimos 30 dias se não informado
    const startDate = startDateStr ? new Date(startDateStr) : new Date(new Date().setDate(endDate.getDate() - 30));

    // Validação de limite de 1 ano para não-administradores
    const umAnoEmMs = 365 * 24 * 60 * 60 * 1000;
    if (ctx.role !== "ADMIN" && (endDate.getTime() - startDate.getTime() > umAnoEmMs)) {
      throw new AppError("O período máximo de consulta para o seu perfil é de 1 ano.", 400);
    }

    // 2. Construção do Filtro de Propriedade (RBAC)
    const whereParams: Prisma.LeadWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      }
    };

    if (ctx.role === "GERENTE") {
      if (!ctx.teamId) throw new AppError("Gerente sem equipe vinculada.", 403);
      whereParams.attendant = { teamId: ctx.teamId };
    } else if (ctx.role === "ATENDENTE") {
      // Embora o foco do dashboard seja gerencial, caso seja acessado, restringe ao usuário
      whereParams.attendantId = ctx.userId;
    }

    // 3. Execução das Consultas (Agregações)
    const [
      totalLeads,
      leadsPorStatus,
      leadsPorOrigem,
      leadsPorImportancia,
      negociacoes
    ] = await Promise.all([
      prisma.lead.count({ where: whereParams }),
      
      prisma.lead.groupBy({
        by: ['status'],
        where: whereParams,
        _count: true,
      }),

      prisma.lead.groupBy({
        by: ['origin'],
        where: whereParams,
        _count: true,
      }),

      prisma.lead.groupBy({
        by: ['importance'],
        where: whereParams,
        _count: true,
      }),

      // Para calcular taxa de conversão, precisamos analisar as negociações vinculadas aos leads filtrados
      prisma.negotiation.findMany({
        where: {
          lead: whereParams
        },
        select: {
          status: true,
          stage: true
        }
      })
    ]);

    // 4. Cálculo de Indicadores Analíticos
    const leadsFinalizados = negociacoes.filter(n => n.status === "encerrada").length;
    const leadsConvertidos = negociacoes.filter(n => n.status === "encerrada" && n.stage === "fechamento").length;
    const taxaConversao = leadsFinalizados > 0 ? ((leadsConvertidos / leadsFinalizados) * 100).toFixed(2) : 0;

    return {
      periodo: { inicio: startDate, fim: endDate },
      operacional: {
        totalLeads,
        leadsPorStatus: leadsPorStatus.map(s => ({ status: s.status, count: s._count })),
        leadsPorOrigem: leadsPorOrigem.map(o => ({ origin: o.origin, count: o._count })),
        leadsPorImportancia: leadsPorImportancia.map(i => ({ importance: i.importance, count: i._count })),
      },
      analitico: {
        totalFinalizados: leadsFinalizados,
        totalConvertidos: leadsConvertidos,
        taxaConversao: `${taxaConversao}%`
      }
    };
  }
}