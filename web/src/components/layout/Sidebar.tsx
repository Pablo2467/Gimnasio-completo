import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const links = [
  { to: "/", label: "Dashboard", adminOnly: true },
  { to: "/members", label: "Clientes" },
  { to: "/membership-plans", label: "Planes" },
  { to: "/products", label: "Productos" },
  { to: "/sales", label: "Ventas" },
];

export function Sidebar() {
  const { role } = useAuth();

  return (
    <aside className="w-56 bg-slate-900 text-slate-200 min-h-screen p-4">
      <h1 className="text-white font-semibold text-lg mb-6">GymFlow</h1>
      <nav className="space-y-1">
        {links
          .filter((l) => !l.adminOnly || role === "ADMIN")
          .map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm ${
                  isActive ? "bg-slate-700 text-white" : "hover:bg-slate-800"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}