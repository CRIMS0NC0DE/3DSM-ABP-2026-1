import { Router } from "express";

import { PrismaUserRepository } from "../repositories/PrismaUserRepository";
import { BcryptPasswordHasher } from "../security/password/BcryptPasswordHasher";
import { PasswordHashAuditDecorator } from "../security/password/PasswordHashAuditDecorator";
import { JwtTokenService } from "../security/token/JwtTokenService";
import { TokenAuditDecorator } from "../security/token/TokenAuditDecorator";
import { AuthService } from "../services/AuthService";
import { CollaboratorService } from "../services/CollaboratorService";
import { createAuthRoutes } from "./authRoutes";
import { createLeadRoutes } from "./leadRoutes";
import { createCollaboratorRoutes } from "./collaboratorRoutes";
import { createAuditRoutes } from "./auditRoutes";

export function createRouter() {
  const router = Router();
  const userRepository = new PrismaUserRepository();
  const passwordHasher = new PasswordHashAuditDecorator(new BcryptPasswordHasher());
  const tokenService = new TokenAuditDecorator(new JwtTokenService());
  const authService = new AuthService(userRepository, passwordHasher, tokenService);
  const collaboratorService = new CollaboratorService(passwordHasher);
  const auditService = new AuditLogService();

  router.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  router.use("/auth", createAuthRoutes(authService));
  router.use("/leads", createLeadRoutes(authService));
  router.use("/collaborators", createCollaboratorRoutes(authService, collaboratorService, auditService));
  router.use("/audit", createAuditRoutes(authService));

  return router;
}
