import { Router } from "express";

import { AuditLogService } from "../services/AuditLogService";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { asyncHandler } from "../middlewares/asyncHandler";
import type { AuthService } from "../services/AuthService";

export function createAuditRoutes(_authService: AuthService) {
  const router = Router();
  const auditService = new AuditLogService();

  // Apenas usuarios autenticados e com role ADMIN
  router.use(authenticate(_authService));
  router.get("/", authorize("ADMIN"), asyncHandler(async (req, res) => {
    const logs = await auditService.listAll(500);
    res.status(200).json({ logs });
  }));

  return router;
}
