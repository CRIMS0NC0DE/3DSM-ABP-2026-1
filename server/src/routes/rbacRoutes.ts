import { Router } from "express";

import prisma from "../config/db";
import { AppError } from "../errors/AppError";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { asyncHandler } from "../middlewares/asyncHandler";
import { PrismaPermissionRepository } from "../repositories/PrismaPermissionRepository";
import { PrismaRoleRepository } from "../repositories/PrismaRoleRepository";
import { PrismaTeamRepository } from "../repositories/PrismaTeamRepository";
import { PermissionService } from "../services/PermissionService";
import { RoleService } from "../services/RoleService";
import type { AuthService } from "../services/AuthService";
import { TeamService } from "../services/TeamService";

export function createRbacRoutes(authService: AuthService) {
  const router = Router();
  const roleService = new RoleService(new PrismaRoleRepository(prisma));
  const permissionService = new PermissionService(new PrismaPermissionRepository(prisma));
  const teamService = new TeamService(new PrismaTeamRepository(prisma));

  router.use(asyncHandler(authenticate(authService)));

  router.get(
    "/roles",
    authorize("ADMIN", "GERENTE_GERAL", "GERENTE"),
    asyncHandler(async (_request, response) => {
      const roles = await roleService.getAllRoles();
      response.status(200).json({ roles });
    }),
  );

  router.get(
    "/permissions",
    authorize("ADMIN"),
    asyncHandler(async (_request, response) => {
      const permissions = await permissionService.getAllPermissions();
      response.status(200).json({ permissions });
    }),
  );

  router.get(
    "/teams",
    authorize("ADMIN", "GERENTE_GERAL", "GERENTE"),
    asyncHandler(async (request, response) => {
      const user = request.authUser;
      if (!user) {
        throw new AppError("Usuario nao autenticado.", 401);
      }

      const teams = user.role === "GERENTE" ? await teamService.getTeamsByManagerId(user.id) : await teamService.getAllTeams();
      response.status(200).json({ teams });
    }),
  );

  router.post(
    "/teams",
    authorize("ADMIN"),
    asyncHandler(async (request, response) => {
      const { name, managerId } = request.body as { name?: string; managerId?: string };
      const team = await teamService.createTeam(name ?? "", managerId ?? "");
      response.status(201).json({ team });
    }),
  );

  router.put(
    "/teams/:id",
    authorize("ADMIN"),
    asyncHandler(async (request, response) => {
      const teamId = String(request.params.id ?? "");
      const { name, managerId } = request.body as { name?: string; managerId?: string };

      if (!teamId) {
        throw new AppError("Equipe nao informada.", 400);
      }

      const team = await teamService.updateTeam(teamId, name, managerId);
      response.status(200).json({ team });
    }),
  );

  router.delete(
    "/teams/:id",
    authorize("ADMIN"),
    asyncHandler(async (request, response) => {
      const teamId = String(request.params.id ?? "");

      if (!teamId) {
        throw new AppError("Equipe nao informada.", 400);
      }

      await teamService.deleteTeam(teamId);
      response.status(204).send();
    }),
  );

  return router;
}
