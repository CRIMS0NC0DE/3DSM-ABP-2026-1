import { Router } from "express";

import { PrismaUserRepository } from "../repositories/PrismaUserRepository";
import { AuthService } from "../services/AuthService";
import { createAuthRoutes } from "./authRoutes";

export function createRouter() {
  const router = Router();
  const userRepository = new PrismaUserRepository();
  const authService = new AuthService(userRepository);

  router.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  router.use("/auth", createAuthRoutes(authService));

  return router;
}

