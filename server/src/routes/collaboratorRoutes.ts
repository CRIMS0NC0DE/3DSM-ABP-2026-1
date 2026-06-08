import { Router } from "express";

import { CollaboratorController } from "../controllers/CollaboratorController";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/asyncHandler";
import type { AuthService } from "../services/AuthService";
import type { CollaboratorService } from "../services/CollaboratorService";

export function createCollaboratorRoutes(authService: AuthService, collaboratorService: CollaboratorService) {
  const router = Router();
  const controller = new CollaboratorController(collaboratorService);

  router.use(asyncHandler(authenticate(authService)));
  router.get("/", asyncHandler(controller.list));
  router.post("/", asyncHandler(controller.create));
  router.patch("/:id", asyncHandler(controller.update));
  router.delete("/:id", asyncHandler(controller.delete));

  return router;
}
