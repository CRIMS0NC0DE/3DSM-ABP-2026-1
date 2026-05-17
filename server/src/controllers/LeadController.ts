import type { Request, Response } from "express";
import { LeadService } from "../services/LeadService";
import { AppError } from "../errors/AppError";

export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  list = async (req: Request, response: Response): Promise<void> => {
    const ctx = {
      userId: req.userId!,
      role: req.userRole!,
      teamId: req.userTeamId ?? null,
    };

    const leads = await this.leadService.listLeads(ctx);
    response.status(200).json({ leads });
  };

  updateStatus = async (req: Request, response: Response): Promise<void> => {
    const rawId = req.params.id;
    const id = typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : undefined;
    if (!id) {
      throw new AppError("Identificador do lead inválido.", 400);
    }
    const ctx = {
      userId: req.userId!,
      role: req.userRole!,
      teamId: req.userTeamId ?? null,
    };

    const negotiation = await this.leadService.updatePipelineStatus(id, req.body, ctx);
    response.status(200).json({ negotiation });
  };
}