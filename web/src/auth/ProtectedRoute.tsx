import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Role } from "../types";

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] }) {
  const { isAuthenticated, role, isRestoring } = useAuth();

  if (isRestoring) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/members" replace />;
  }
  return <Outlet />;
}