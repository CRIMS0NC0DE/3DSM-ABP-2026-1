import type { Request, Response } from "express";

import type { FinanceService } from "../services/FinanceService";

export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  list = async (request: Request, response: Response): Promise<void> => {
    const result = await this.financeService.list(request.authUser!, request.query);
    response.status(200).json({ entries: result.data, pagination: result.pagination });
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const entry = await this.financeService.create(request.authUser!, request.body);
    response.status(201).json({ entry });
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    await this.financeService.delete(request.authUser!, String(request.params.id ?? ""));
    response.status(204).send();
  };
}
