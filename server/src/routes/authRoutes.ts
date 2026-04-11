import { Router } from "express";

import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authorize } from "../middlewares/authorize";
import type { AuthService } from "../services/AuthService";

export function createAuthRoutes(authService: AuthService) {
  const router = Router();
  const controller = new AuthController(authService);

  router.post("/login", asyncHandler(controller.login));
  router.get("/me", asyncHandler(authenticate(authService)), asyncHandler(controller.me));
  router.get(
    "/management",
    asyncHandler(authenticate(authService)),
    authorize("ADMINISTRADOR", "GERENTE_GERAL", "GERENTE"),
    asyncHandler(async (request, response) => {
      response.status(200).json({
        message: "Acesso liberado para area gerencial.",
        user: request.authUser,
      });
    }),
  );

  return router;
}
