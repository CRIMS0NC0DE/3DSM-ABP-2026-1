import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError";
import type { AuthService } from "../services/AuthService";

export function authenticate(authService: AuthService) {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      next(new AppError("Token de acesso nao informado.", 401));
      return;
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      next(new AppError("Formato de token invalido.", 401));
      return;
    }

    const payload = authService.verifyToken(token);
    const user = await authService.getUserFromTokenSubject(payload.sub);

    (request as any).authUser = user;
    (request as any).userId = user.id;
    (request as any).userRole = user.role;
    (request as any).userTeamId = user.teamId ?? null;
    next();
  };
}

