import type { UserRole } from "../domain/entities/User";

export interface UserContext {
  userId: string;
  role: UserRole;
  teamId?: string | null;
}