import { Link, useLocation } from "react-router-dom";
import { useSales } from "./useSales";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";

const COP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export function SalesListPage() {
  const { data: sales, isLoading } = useSales();
  const location = useLocation();
  const createdSaleId = (location.state as { createdSaleId?: number } | null)?.createdSaleId;

  if (isLoading) return <p className="text-sm text-iron-400">Cargando ventas…</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Ventas</h1>
        <Link to="/sales/new">
          <Button>Nueva venta</Button>
        </Link>
      </div>

      {createdSaleId && (
        <p className="border-l-2 border-plate-green bg-white px-4 py-2.5 mb-4 text-sm">
          Venta #{createdSaleId} registrada correctamente.
        </p>
      )}

      <DataTable
        rows={sales}
        rowKey={(s) => s.id}
        empty="Aún no hay ventas registradas."
        renderExpanded={(s) => (
          <div>
            <p className="text-xs font-semibold text-iron-400 mb-2">Productos de la venta #{s.id}</p>
            <table className="w-full">
              <tbody>
                {s.items.map((item) => (
                  <tr key={item.productId} className="border-b border-iron-200/60 last:border-0">
                    <td className="py-1.5 text-sm">{item.productName}</td>
                    <td className="py-1.5 text-sm text-iron-400 text-right">× {item.quantity}</td>
                    <td className="py-1.5 text-sm text-right tabular w-28">{COP.format(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        columns={[
          { header: "#", sortValue: (s) => s.id, cell: (s) => <span className="text-iron-400">{s.id}</span> },
          { header: "Cliente", sortValue: (s) => s.memberName ?? "", cell: (s) => s.memberName ?? "—" },
          { header: "Empleado", cell: (s) => <span className="text-iron-700">{s.employeeEmail}</span> },
          {
            header: "Total",
            align: "right",
            sortValue: (s) => s.total,
            cell: (s) => <span className="tabular font-medium">{COP.format(s.total)}</span>,
          },
          { header: "Estado", cell: (s) => <StatusBadge status={s.status} /> },
          {
            header: "Fecha",
            align: "right",
            sortValue: (s) => s.createdAt,
            cell: (s) => (
              <span className="text-iron-400 text-xs">
                {new Date(s.createdAt).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}