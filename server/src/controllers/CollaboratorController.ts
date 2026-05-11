import type { Request, Response } from "express";

import type { CollaboratorService } from "../services/CollaboratorService";

export class CollaboratorController {
  constructor(private readonly collaboratorService: CollaboratorService) {}

  list = async (_request: Request, response: Response): Promise<void> => {
    const collaborators = await this.collaboratorService.list();
    response.status(200).json({ collaborators });
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const collaborator = await this.collaboratorService.create(request.body);
    response.status(201).json({ collaborator });
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const collaborator = await this.collaboratorService.update(Number(request.params.id), request.body);
    response.status(200).json({ collaborator });
  };
}
