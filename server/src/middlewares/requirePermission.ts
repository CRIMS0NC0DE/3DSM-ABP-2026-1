import type { NextFunction, Request, Response } from "express";

import prisma from "../config/db";
import { AppError } from "../errors/AppError";

export function requirePermission(permissionName: string) {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const actor = request.authUser;

    if (!actor) {
      next(new AppError("Usuario nao autenticado.", 401));
      return;
    }

    if (actor.role === "ADMIN") {
      next();
      return;
    }

    const role = await prisma.role.findFirst({
      where: {
        name: actor.role,
        permissions: { some: { name: permissionName } },
      },
      select: { id: true },
    });

    if (!role) {
      next(new AppError("Voce nao tem permissao para acessar este recurso.", 403));
      return;
    }

    next();
  };
}
