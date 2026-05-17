import { Router } from "express";
import { LeadController } from "../controllers/LeadController";
import { LeadService } from "../services/LeadService";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requireAuth } from "../middlewares/rbac";
import type { AuthService } from "../services/AuthService";

export function createLeadRoutes(authService: AuthService) {
  const leadRoutes = Router();
  const leadService = new LeadService();
  const leadController = new LeadController(leadService);
  const auth = asyncHandler(authenticate(authService));

  leadRoutes.get("/", auth, requireAuth(), asyncHandler(leadController.list));
  leadRoutes.patch("/:id", auth, requireAuth(), asyncHandler(leadController.updateStatus));

  return leadRoutes;
}