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
  router.patch("/me", asyncHandler(authenticate(authService)), asyncHandler(controller.updateMe));
  router.get(
    "/users",
    asyncHandler(authenticate(authService)),
    authorize("ADMIN", "GERENTE"),
    asyncHandler(controller.listUsers),
  );
  router.post(
    "/users",
    asyncHandler(authenticate(authService)),
    authorize("ADMIN", "GERENTE"),
    asyncHandler(controller.register),
  );
  router.put(
    "/users/:id",
    asyncHandler(authenticate(authService)),
    authorize("ADMIN", "GERENTE"),
    asyncHandler(controller.updateUser),
  );
  router.delete(
    "/users/:id",
    asyncHandler(authenticate(authService)),
    authorize("ADMIN", "GERENTE"),
    asyncHandler(controller.deleteUser),
  );
  router.post(
    "/register",
    asyncHandler(authenticate(authService)),
    authorize("ADMIN", "GERENTE"),
    asyncHandler(controller.register),
  );
  router.get(
    "/management",
    asyncHandler(authenticate(authService)),
    authorize("ADMIN", "GERENTE_GERAL", "GERENTE"),
    asyncHandler(async (request, response) => {
      response.status(200).json({
        message: "Acesso liberado para area gerencial.",
        user: request.authUser,
      });
    }),
  );

  return router;
}
