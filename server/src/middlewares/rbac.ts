import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

// Estender interface Express Request para incluir dados do usuário
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      userTeamId?: string | null;
    }
  }
}

/**
 * Middleware para validar se o usuário tem um dos roles necessários
 * @param allowedRoles - Array de roles permitidos
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.userRole;

    if (!userRole) {
      throw new AppError("Usuário não autenticado", 401);
    }

    if (!allowedRoles.includes(userRole)) {
      throw new AppError(
        `Acesso negado. Roles necessários: ${allowedRoles.join(", ")}`,
        403
      );
    }

    next();
  };
};

/**
 * Middleware para validar se o usuário é administrador
 */
export const requireAdmin = () => {
  return requireRole(["ADMIN"]);
};

/**
 * Middleware para validar se o usuário é gerente ou superior
 */
export const requireManager = () => {
  return requireRole(["GERENTE", "GERENTE_GERAL", "ADMIN"]);
};

/**
 * Middleware para validar se o recurso pertence ao usuário ou sua equipe
 * @param resourceUserId - ID do usuário propietário do recurso
 */
export const checkResourceOwnership = (resourceUserId?: string, resourceTeamId?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const userRole = req.userRole;
    const userTeamId = req.userTeamId;

    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    // Admin tem acesso a tudo
    if (userRole === "ADMIN") {
      return next();
    }

    // Atendente só pode acessar seus próprios recursos
    if (userRole === "ATENDENTE") {
      if (userId !== resourceUserId) {
        throw new AppError("Acesso negado. Você só pode acessar seus próprios recursos.", 403);
      }
      return next();
    }

    // Gerente pode acessar recursos de sua equipe
    if (userRole === "GERENTE") {
      if (userId !== resourceUserId && resourceTeamId !== userTeamId) {
        throw new AppError("Acesso negado. Você só pode acessar recursos de sua equipe.", 403);
      }
      return next();
    }

    // Gerente Geral tem acesso a tudo
    if (userRole === "GERENTE_GERAL") {
      return next();
    }

    throw new AppError("Acesso negado", 403);
  };
};

/**
 * Middleware para validar se o usuário está autenticado
 */
export const requireAuth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new AppError("Usuário não autenticado", 401);
    }
    next();
  };
};
