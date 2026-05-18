import { Router } from "express";

import { LeadController } from "../controllers/LeadController";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/asyncHandler";
import type { AuthService } from "../services/AuthService";
import { LeadService } from "../services/LeadService";
import { PrismaLeadRepository } from "../repositories/PrismaLeadRepository";
import { PrismaUserRepository } from "../repositories/PrismaUserRepository";

export function createLeadRoutes(authService: AuthService) {
  const router = Router();
  const leadRepository = new PrismaLeadRepository();
  const userRepository = new PrismaUserRepository();
  const leadService = new LeadService(leadRepository, userRepository);
  const controller = new LeadController(leadService);

  router.use(authenticate(authService));

  router.get("/",            asyncHandler(controller.list));
  router.post("/",           asyncHandler(controller.create));
  router.get("/assignable",  asyncHandler(controller.listAssignable));
  router.patch("/:id/status", asyncHandler(controller.updateStatus));
  router.patch("/:id/assign", asyncHandler(controller.assign));

  return router;
}
