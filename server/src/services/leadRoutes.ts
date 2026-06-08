import { Router } from "express";
import { LeadController } from "../controllers/LeadController";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/asyncHandler";
import type { AuthService } from "../services/AuthService";

export function createLeadRoutes(authService: AuthService, controller: LeadController) {
  const router = Router();

  router.post("/archive", asyncHandler(authenticate(authService)), asyncHandler(controller.archive));

  return router;
}