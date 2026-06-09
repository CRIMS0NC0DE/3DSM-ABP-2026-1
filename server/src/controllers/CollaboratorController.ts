import type { Request, Response } from "express";

import type { CollaboratorService } from "../services/CollaboratorService";
import type { AuditLogService } from "../services/AuditLogService";

export class CollaboratorController {
  constructor(
    private readonly collaboratorService: CollaboratorService,
    private readonly auditService?: AuditLogService,
  ) {}

  list = async (_request: Request, response: Response): Promise<void> => {
    const collaborators = await this.collaboratorService.list();
    response.status(200).json({ collaborators });
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser!;
    const collaborator = await this.collaboratorService.create(request.body);

    if (this.auditService) {
      await this.auditService.create({
        userId: actor.id,
        entityType: "collaborator",
        entityId: collaborator.id,
        action: "create",
        changes: {
          collaborator,
        },
      });
    }

    response.status(201).json({ collaborator });
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser!;
    const idParam = request.params.id;
    if (!idParam || Array.isArray(idParam)) {
      response.status(400).json({ error: "Invalid collaborator id" });
      return;
    }

    const collaborator = await this.collaboratorService.update(idParam, request.body);

    if (this.auditService) {
      await this.auditService.create({
        userId: actor.id,
        entityType: "collaborator",
        entityId: collaborator.id,
        action: "update",
        changes: {
          input: request.body,
          collaborator,
        },
      });
    }

    response.status(200).json({ collaborator });
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser!;
    const idParam = request.params.id;
    if (!idParam || Array.isArray(idParam)) {
      response.status(400).json({ error: "Invalid collaborator id" });
      return;
    }

    const collaborator = await this.collaboratorService.delete(idParam);

    if (this.auditService) {
      await this.auditService.create({
        userId: actor.id,
        entityType: "collaborator",
        entityId: collaborator.id,
        action: "delete",
        changes: {
          collaborator,
        },
      });
    }

    response.status(200).json({ success: true });
  };
}
