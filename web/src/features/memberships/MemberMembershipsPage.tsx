import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemberMemberships, useContractMembership, useMembershipPlans } from "./useMemberships";
import { paymentsApi } from "../../api/payments";
import { Button } from "../../components/ui/Button";
import type { PaymentMethod } from "../../types";

export function MemberMembershipsPage() {
  const { id } = useParams<{ id: string }>();
  const memberId = Number(id);
  const qc = useQueryClient();

  const { data: memberships, isLoading } = useMemberMemberships(memberId);
  const { data: plans } = useMembershipPlans();
  const contract = useContractMembership(memberId);

  const pay = useMutation({
    mutationFn: (vars: { membershipId: number; amount: number; method: PaymentMethod }) =>
      paymentsApi.create({ membershipId: vars.membershipId, amount: vars.amount, method: vars.method }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["memberships", memberId] }),
  });

  if (isLoading) return <p className="p-6">Cargando...</p>;

  function planPrice(planName: string) {
    return plans?.find((p) => p.name === planName)?.price ?? 0;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Membresías del cliente #{memberId}</h1>

      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="text-left border-b text-sm text-slate-600">
            <th className="py-2">Plan</th>
            <th>Desde</th>
            <th>Hasta</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {memberships?.map((m) => (
            <tr key={m.id} className="border-b text-sm">
              <td className="py-2">{m.planName}</td>
              <td>{m.startDate}</td>
              <td>{m.endDate}</td>
              <td>{m.status}</td>
              <td className="text-right">
                {m.status === "PENDING" && (
                  <Button
                    onClick={() =>
                      pay.mutate({ membershipId: m.id, amount: planPrice(m.planName), method: "CASH" })
                    }
                    disabled={pay.isPending}
                  >
                    Pagar (${planPrice(m.planName).toLocaleString("es-CO")})
                  </Button>
                )}
              </td>
            </tr>
          ))}
          {memberships?.length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-center text-slate-400">
                Sin membresías todavía
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 className="font-semibold mb-3">Contratar plan nuevo</h2>
      <div className="flex flex-wrap gap-3">
        {plans?.map((plan) => (
          <div key={plan.id} className="border rounded-lg p-3 flex items-center gap-3">
            <span className="text-sm">{plan.name} — ${plan.price.toLocaleString("es-CO")}</span>
            <Button onClick={() => contract.mutate({ planId: plan.id })} disabled={contract.isPending}>
              Contratar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}