import type { MembershipPlan } from "../../types";

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

interface PlanCardProps {
  plan: MembershipPlan;
  canManage?: boolean;
  onEdit?: (plan: MembershipPlan) => void;
  onDelete?: (plan: MembershipPlan) => void;
}

export function PlanCard({ plan, canManage, onEdit, onDelete }: PlanCardProps) {
  return (
    <div className="group border border-iron-200 bg-white overflow-hidden flex flex-col">
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-iron-950">{plan.name}</h3>
          {canManage && (
            <div className="flex gap-2 shrink-0 pt-0.5">
              <button
                onClick={() => onEdit?.(plan)}
                className="text-xs text-plate-blue hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete?.(plan)}
                className="text-xs text-plate-red hover:underline"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
        {plan.description && (
          <p className="mt-1 text-sm text-iron-400 line-clamp-2">{plan.description}</p>
        )}

        <div className="mt-4 flex items-baseline justify-between">
          <span className="font-stamp text-3xl font-semibold tabular">
            {COP.format(plan.price)}
          </span>
          <span className="text-xs text-iron-400 uppercase tracking-wide">
            {plan.durationDays} días
          </span>
        </div>
      </div>

      <div className="aspect-[4/3] bg-iron-50 overflow-hidden">
        {plan.imageUrl ? (
          <img
            src={plan.imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300
                       group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-iron-200">
            <span className="font-stamp text-5xl">{plan.name.charAt(0)}</span>
          </div>
        )}
      </div>
    </div>
  );
}