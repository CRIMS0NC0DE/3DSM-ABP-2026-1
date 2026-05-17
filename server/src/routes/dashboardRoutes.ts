import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { DashboardService } from "../services/DashboardService";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requireAuth, requireManager } from "../middlewares/rbac";
import type { AuthService } from "../services/AuthService";

export function createDashboardRoutes(authService: AuthService) {
  const dashboardRoutes = Router();
  const dashboardService = new DashboardService();
  const dashboardController = new DashboardController(dashboardService);
  const auth = asyncHandler(authenticate(authService));

  dashboardRoutes.get(
    "/metrics",
    auth,
    requireAuth(),
    requireManager(),
    asyncHandler(dashboardController.getDashboardMetrics),
  );

  return dashboardRoutes;
}