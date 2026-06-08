import { Router } from "express";

import { PrismaUserRepository } from "../repositories/PrismaUserRepository";
import { BcryptPasswordHasher } from "../security/password/BcryptPasswordHasher";
import { PasswordHashAuditDecorator } from "../security/password/PasswordHashAuditDecorator";
import { JwtTokenService } from "../security/token/JwtTokenService";
import { TokenAuditDecorator } from "../security/token/TokenAuditDecorator";
import { AuthService } from "../services/AuthService";
import { LeadService } from "../services/LeadService";
import { LeadController } from "../controllers/LeadController";
import { createAuthRoutes } from "./authRoutes";
import { createLeadRoutes } from "./leadRoutes";

export function createRouter() {
  const router = Router();
  const userRepository = new PrismaUserRepository();
  const passwordHasher = new PasswordHashAuditDecorator(new BcryptPasswordHasher());
  const tokenService = new TokenAuditDecorator(new JwtTokenService());
  const authService = new AuthService(userRepository, passwordHasher, tokenService);
  const leadService = new LeadService();
  const leadController = new LeadController(leadService);

  router.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  router.use("/auth", createAuthRoutes(authService));
  router.use("/leads", createLeadRoutes(authService, leadController));

  return router;
}
