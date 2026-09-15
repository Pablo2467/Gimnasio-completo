// features/sales/SalesListPage.tsx
import { Link, useLocation } from "react-router-dom";
import { useSales } from "./useSales";
import { Button } from "../../components/ui/Button";

export function SalesListPage() {
  const { data: sales, isLoading } = useSales();
  const location = useLocation();
  const createdSaleId = (location.state as { createdSaleId?: number } | null)?.createdSaleId;

  if (isLoading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Ventas</h1>
        <Link to="/sales/new">
          <Button>+ Nueva venta</Button>
        </Link>
      </div>

      {createdSaleId && (
        <p className="text-green-700 bg-green-50 border border-green-200 rounded p-3 mb-4 text-sm">
          Venta #{createdSaleId} registrada correctamente.
        </p>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b text-sm text-slate-600">
            <th className="py-2">#</th>
            <th>Cliente</th>
            <th>Empleado</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {sales?.map((s) => (
            <tr key={s.id} className="border-b text-sm">
              <td className="py-2">{s.id}</td>
              <td>{s.memberName ?? "—"}</td>
              <td>{s.employeeEmail}</td>
              <td>${s.total.toLocaleString("es-CO")}</td>
              <td>{s.status}</td>
              <td>{new Date(s.createdAt).toLocaleString("es-CO")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}