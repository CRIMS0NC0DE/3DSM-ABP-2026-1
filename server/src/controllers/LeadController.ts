import type { Request, Response } from "express";

import type { LeadService } from "../services/LeadService";

export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  list = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser!;
    const leads = await this.leadService.listLeads(actor);
    response.status(200).json({ leads });
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser!;
    const lead = await this.leadService.createLead(actor, request.body);
    response.status(201).json({ lead });
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const actor  = request.authUser!;
    const leadId = String(request.params.id ?? "");
    const lead   = await this.leadService.updateLead(actor, leadId, request.body);
    response.status(200).json({ lead });
  };

  updateStatus = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser!;
    const leadId = String(request.params.id ?? "");
    const lead = await this.leadService.updateStatus(actor, leadId, request.body);
    response.status(200).json({ lead });
  };

  assign = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser!;
    const leadId = String(request.params.id ?? "");
    const lead = await this.leadService.assignLead(actor, leadId, request.body);
    response.status(200).json({ lead });
  };

  listAssignable = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser!;
    const users = await this.leadService.listAssignable(actor);
    response.status(200).json({ users });
  };

  archive = async (_request: Request, response: Response): Promise<void> => {
    const result = await this.leadService.arquivarLeadsFinalizados();
    response.status(200).json({ message: `${result.count} leads foram movidos para o arquivo.` });
  };

  listArchived = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser!;
    const leads = await this.leadService.listArchived(actor);
    response.status(200).json({ leads });
  };

  unarchive = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser!;
    const leadId = String(request.params.id ?? "");
    const lead = await this.leadService.unarchiveLead(actor, leadId);
    response.status(200).json({ lead });
  };
}
