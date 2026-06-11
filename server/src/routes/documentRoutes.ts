import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Router } from "express";
import multer from "multer";

import { DocumentController } from "../controllers/DocumentController";
import { Permission } from "../domain/entities/Permission";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requirePermission } from "../middlewares/requirePermission";
import { PrismaDocumentRepository } from "../repositories/PrismaDocumentRepository";
import type { AuthService } from "../services/AuthService";
import { DocumentService, MAX_DOCUMENT_UPLOAD_BYTES } from "../services/DocumentService";

const uploadsDir = path.resolve(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_request, _file, callback) => callback(null, uploadsDir),
    filename: (_request, file, callback) => {
      const extension = path.extname(file.originalname);
      callback(null, `${crypto.randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: MAX_DOCUMENT_UPLOAD_BYTES },
});

export function createDocumentRoutes(authService: AuthService) {
  const router = Router();
  const service = new DocumentService(new PrismaDocumentRepository(), uploadsDir);
  const controller = new DocumentController(service);

  router.use(asyncHandler(authenticate(authService)));

  router.get("/", requirePermission(Permission.DOCUMENTS_VIEW), asyncHandler(controller.list));
  router.get("/:id", requirePermission(Permission.DOCUMENTS_VIEW), asyncHandler(controller.get));
  router.post("/links", requirePermission(Permission.DOCUMENTS_CREATE), asyncHandler(controller.createLink));
  router.post(
    "/arquivos",
    requirePermission(Permission.DOCUMENTS_CREATE),
    upload.single("file"),
    asyncHandler(controller.createFile),
  );
  router.get("/:id/download", requirePermission(Permission.DOCUMENTS_VIEW), asyncHandler(controller.download));
  router.get("/:id/raw", requirePermission(Permission.DOCUMENTS_VIEW), asyncHandler(controller.raw));
  router.delete("/:id", requirePermission(Permission.DOCUMENTS_DELETE), asyncHandler(controller.delete));

  return router;
}
