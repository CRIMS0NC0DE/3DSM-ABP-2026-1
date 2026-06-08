import type { AuthenticatedUser } from "../../services/AuthService";

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthenticatedUser;
      userId?: string;
      userRole?: string;
      userTeamId?: string | null;
    }
  }
}
