import { Navigate, Outlet } from "react-router-dom";

import { buildDefaultPermissoes, landingPathForRole, type PermissionKey } from "../Collaborators/types";
import { useAuth } from "../../contexts/useAuth";

interface Props {
  permission: PermissionKey;
}

export default function PermissionRoute({ permission }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!buildDefaultPermissoes(user.role)[permission]) {
    return <Navigate to={landingPathForRole(user.role)} replace />;
  }

  return <Outlet />;
}
