import type { NextFunction, Request, Response } from "express";

import type { UserRole } from "../domain/entities/User";
import { AppError } from "../errors/AppError";

export function authorize(...allowedRoles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const authenticatedUser = request.authUser;

    if (!authenticatedUser) {
      next(new AppError("Usuario nao autenticado.", 401));
      return;
    }

    if (!allowedRoles.includes(authenticatedUser.role)) {
      next(new AppError("Acesso negado para este perfil.", 403));
      return;
    }

    next();
  };
}

