import { Request, Response } from "express";
import { DashboardService } from "../services/DashboardService";

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
    const ctx = {
      userId: req.userId!,
      role: req.userRole!,
      teamId: req.userTeamId ?? null,
    };

    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    const metrics = await this.dashboardService.getMetrics(ctx, startDate, endDate);
    
    res.status(200).json(metrics);
  };
}