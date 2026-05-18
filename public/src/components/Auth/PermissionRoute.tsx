import { Navigate, Outlet } from "react-router-dom";

import { buildDefaultPermissoes, type PermissionKey } from "../Collaborators/types";
import { useAuth } from "../../contexts/useAuth";

interface Props {
  permission: PermissionKey;
}

export default function PermissionRoute({ permission }: Props) {
  const { user } = useAuth();

  if (!user || !buildDefaultPermissoes(user.role)[permission]) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
