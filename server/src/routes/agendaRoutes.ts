import { Router } from "express";

import { AgendaController } from "../controllers/AgendaController";
import { Permission } from "../domain/entities/Permission";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requirePermission } from "../middlewares/requirePermission";
import { PrismaAgendaEventRepository } from "../repositories/PrismaAgendaEventRepository";
import type { AuthService } from "../services/AuthService";
import { AgendaService } from "../services/AgendaService";

export function createAgendaRoutes(authService: AuthService) {
  const router = Router();
  const controller = new AgendaController(new AgendaService(new PrismaAgendaEventRepository()));

  router.use(asyncHandler(authenticate(authService)));

  router.get("/", requirePermission(Permission.AGENDA_VIEW), asyncHandler(controller.list));
  router.post("/", requirePermission(Permission.AGENDA_CREATE), asyncHandler(controller.create));
  router.patch("/:id/status", requirePermission(Permission.AGENDA_CREATE), asyncHandler(controller.updateStatus));
  router.delete("/:id", requirePermission(Permission.AGENDA_DELETE), asyncHandler(controller.delete));

  return router;
}
