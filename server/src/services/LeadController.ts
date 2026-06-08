import type { Request, Response } from "express";
import { LeadService } from "../services/LeadService";

export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  archive = async (req: Request, res: Response) => {
    const result = await this.leadService.arquivarLeadsFinalizados();
    
    return res.json({
      message: `${result.count} leads foram movidos para o arquivo.`, 
    });
  };
}