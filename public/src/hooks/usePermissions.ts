import { useMemo } from "react";
import { buildDefaultPermissoes, type PermissionKey } from "../components/Collaborators/types";
import { useAuth } from "../contexts/useAuth";

export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo(
    () => (user ? buildDefaultPermissoes(user.role) : null),
    [user?.role],
  );

  function can(key: PermissionKey): boolean {
    return permissions?.[key] ?? false;
  }

  return { can };
}
