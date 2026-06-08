import prisma from "../config/db";

export class LeadService {
  async arquivarLeadsFinalizados() {
    // Arquiva todos os leads que possuem status de conclusão
    return await prisma.lead.updateMany({
      where: {
        statusLead: { in: ["Fechado", "Perdido"] },
        archive: false,
      },
      data: {
        archive: true,
      },
    });
  }
}
