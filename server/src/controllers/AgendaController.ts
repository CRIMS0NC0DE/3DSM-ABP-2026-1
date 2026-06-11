import type { Request, Response } from "express";

import type { AgendaService } from "../services/AgendaService";

export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  list = async (request: Request, response: Response): Promise<void> => {
    const result = await this.agendaService.list(request.authUser!, request.query);
    response.status(200).json({ events: result.data, pagination: result.pagination });
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const event = await this.agendaService.create(request.authUser!, request.body);
    response.status(201).json({ event });
  };

  updateStatus = async (request: Request, response: Response): Promise<void> => {
    const event = await this.agendaService.updateStatus(
      request.authUser!,
      String(request.params.id ?? ""),
      request.body,
    );
    response.status(200).json({ event });
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    await this.agendaService.delete(request.authUser!, String(request.params.id ?? ""));
    response.status(204).send();
  };
}
