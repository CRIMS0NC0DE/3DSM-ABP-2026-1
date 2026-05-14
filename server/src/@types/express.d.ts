import type { User } from "../domain/entities/User";

declare global {
  namespace Express {
    interface Request {
      authUser?: User;
      userId?: string;
      userRole?: User["role"];
      userTeamId?: string | null;
    }
  }
}

export {};
