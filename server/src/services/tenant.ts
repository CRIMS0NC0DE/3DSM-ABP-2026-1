import type { AuthenticatedUser } from "./AuthService";

export function resolveCompanyId(actor: AuthenticatedUser): string {
  return actor.teamId ?? "default-company";
}
