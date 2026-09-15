import { useDashboardSummary } from "./useDashboard";

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isLoading) {
    return <div className="h-28 border border-iron-200 bg-white animate-pulse" />;
  }

  if (isError || !data) {
    return (
      <div className="border border-plate-red/30 bg-white px-6 py-8 text-sm">
        <p className="text-iron-950 font-medium mb-1">No se pudieron cargar las métricas</p>
        <p className="text-iron-700">Revisa que el servidor esté disponible y vuelve a intentar.</p>
      </div>
    );
  }

  const metrics = [
    { value: String(data.activeMembers), label: "clientes activos" },
    { value: String(data.activeMemberships), label: "membresías vigentes" },
    { value: COP.format(data.revenueThisMonth), label: "ingresos del mes" },
    { value: String(data.salesToday), label: "ventas de hoy" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Resumen</h1>

      {/* Una banda con divisores, no cuatro cards con sombra */}
      <div className="border border-iron-200 bg-white grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-iron-200">
        {metrics.map((m) => (
          <div key={m.label} className="px-6 py-7">
            <p className="font-stamp text-5xl leading-none font-semibold tabular">
              {m.value}
            </p>
            <p className="mt-2 text-sm text-iron-400">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}