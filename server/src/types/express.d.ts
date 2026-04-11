import type { AuthenticatedUser } from "../services/AuthService";

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthenticatedUser;
    }
  }
}

export {};

