import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const links = [
  { to: "/", label: "Resumen", adminOnly: true },
  { to: "/members", label: "Clientes" },
  { to: "/membership-plans", label: "Planes" },
  { to: "/products", label: "Productos" },
  { to: "/sales", label: "Ventas" },
];

export function Sidebar() {
  const { role } = useAuth();

  return (
    <aside className="w-52 shrink-0 bg-iron-950 min-h-screen flex flex-col">
      <div className="h-14 flex items-center px-5 border-b border-white/10">
        <span className="font-stamp text-xl font-semibold tracking-wide text-white">
          GYMFLOW
        </span>
      </div>

      <nav className="flex-1 py-3">
        {links
          .filter((l) => !l.adminOnly || role === "ADMIN")
          .map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `flex items-center px-5 py-2.5 text-sm border-l-2 transition-colors ${
                  isActive
                    ? "border-plate-blue bg-white/5 text-white font-medium"
                    : "border-transparent text-iron-400 hover:text-white hover:bg-white/5"
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