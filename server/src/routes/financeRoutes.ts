import { Router } from "express";

import { FinanceController } from "../controllers/FinanceController";
import { Permission } from "../domain/entities/Permission";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requirePermission } from "../middlewares/requirePermission";
import { PrismaFinanceEntryRepository } from "../repositories/PrismaFinanceEntryRepository";
import type { AuthService } from "../services/AuthService";
import { FinanceService } from "../services/FinanceService";

export function createFinanceRoutes(authService: AuthService) {
  const router = Router();
  const controller = new FinanceController(new FinanceService(new PrismaFinanceEntryRepository()));

  router.use(asyncHandler(authenticate(authService)));
  router.use(requirePermission(Permission.FINANCE_MANAGE));

  router.get("/", asyncHandler(controller.list));
  router.post("/", asyncHandler(controller.create));
  router.delete("/:id", asyncHandler(controller.delete));

  return router;
}
