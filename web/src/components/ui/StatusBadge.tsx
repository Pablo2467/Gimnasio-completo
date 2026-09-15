// components/ui/StatusBadge.tsx
const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  // Member
  ACTIVE: { label: "Activo", className: "text-plate-green border-plate-green/40 bg-plate-green/5" },
  INACTIVE: { label: "Inactivo", className: "text-iron-400 border-iron-200 bg-iron-50" },
  // Membership
  PENDING: { label: "Pago pendiente", className: "text-plate-amber border-plate-amber/40 bg-plate-amber/5" },
  EXPIRED: { label: "Vencida", className: "text-plate-red border-plate-red/40 bg-plate-red/5" },
  CANCELLED: { label: "Cancelada", className: "text-iron-400 border-iron-200 bg-iron-50" },
  // Sale / Payment
  COMPLETED: { label: "Completada", className: "text-plate-green border-plate-green/40 bg-plate-green/5" },
  REFUNDED: { label: "Devuelta", className: "text-plate-amber border-plate-amber/40 bg-plate-amber/5" },
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? {
    label: status,
    className: "text-iron-700 border-iron-200 bg-white",
  };
  return (
    <span className={`inline-block border px-2 py-0.5 text-xs font-medium rounded-sm ${style.className}`}>
      {style.label}
    </span>
  );
}