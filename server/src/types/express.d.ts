import type { UserRole } from "../domain/entities/User";
import type { AuthenticatedUser } from "../services/AuthService";

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthenticatedUser;
      userId?: string;
      userRole?: UserRole;
      userTeamId?: string | null;
    }
  }
}

export {};

