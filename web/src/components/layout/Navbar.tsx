import { useAuth } from "../../auth/AuthContext";
import { Button } from "../ui/Button";

export function Navbar() {
  const { role, logout } = useAuth();

  return (
    <header className="h-14 border-b flex items-center justify-between px-6 bg-white">
      <span className="text-sm text-slate-500">Rol: {role}</span>
      <Button variant="ghost" onClick={logout}>
        Cerrar sesión
      </Button>
    </header>
  );
}