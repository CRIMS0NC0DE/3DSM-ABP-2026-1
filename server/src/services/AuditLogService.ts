import prisma from "../config/db";

export class AuditLogService {
  async create(params: {
    userId?: string | null;
    entityType: string;
    entityId: string;
    action: string;
    changes?: unknown;
  }) {
    const { userId = null, entityType, entityId, action, changes = null } = params;
    return prisma.auditLog.create({
      data: {
        userId,
        entityType,
        entityId,
        action,
        changes,
      },
    });
  }

  async listAll(limit = 100) {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { user: true },
    });
  }
}
