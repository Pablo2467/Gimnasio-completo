// features/dashboard/DashboardPage.tsx
import { useDashboardSummary } from "./useDashboard";
import { useAuth } from "../../auth/AuthContext";

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
}

export function DashboardPage() {
  const { role } = useAuth();
  const { data, isLoading, isError } = useDashboardSummary();

  if (role !== "ADMIN") {
    return <p className="p-6 text-slate-500">Esta sección es solo para administradores.</p>;
  }

  if (isLoading) return <p className="p-6">Cargando...</p>;
  if (isError || !data) return <p className="p-6 text-red-600">No se pudo cargar el dashboard.</p>;

  const cards = [
    { label: "Clientes activos", value: data.activeMembers },
    { label: "Membresías activas", value: data.activeMemberships },
    { label: "Ingresos este mes", value: formatCOP(data.revenueThisMonth) },
    { label: "Ventas hoy", value: data.salesToday },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border rounded-lg p-4">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="text-2xl font-semibold mt-1">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}