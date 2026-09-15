import { useAuth } from "../../auth/AuthContext";
import { Button } from "../ui/Button";

const ROLE_LABELS = { ADMIN: "Administrador", RECEPCIONISTA: "Recepción" } as const;

export function Navbar() {
  const { role, logout } = useAuth();

  return (
    <header className="h-14 shrink-0 border-b border-iron-200 bg-white flex items-center justify-between px-6">
      <span className="text-sm text-iron-700">
        {role ? ROLE_LABELS[role] : ""}
      </span>
      <Button variant="ghost" size="sm" onClick={logout}>
        Cerrar sesión
      </Button>
    </header>
  );
}