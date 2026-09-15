import { useState } from "react";
import { useMembershipPlans, useCreateMembershipPlan } from "./useMemberships";
import { useAuth } from "../../auth/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PlanCard } from "./PlanCard";

export function MembershipPlansPage() {
  const { data: plans, isLoading } = useMembershipPlans();
  const createPlan = useCreateMembershipPlan();
  const { role } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: 0, durationDays: 30, imageUrl: "" });

  if (isLoading) return <p className="text-sm text-iron-400">Cargando planes…</p>;

  async function handleCreate() {
    await createPlan.mutateAsync(form);
    setForm({ name: "", description: "", price: 0, durationDays: 30, imageUrl: "" });
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Planes de membresía</h1>
        {role === "ADMIN" && (
          <Button onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancelar" : "Nuevo plan"}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-iron-200 p-5 mb-6 max-w-md space-y-3">
          <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Precio" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <Input label="Duración (días)" type="number" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })} />
          <Input label="URL de imagen" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <Button onClick={handleCreate}>Guardar plan</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans?.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}