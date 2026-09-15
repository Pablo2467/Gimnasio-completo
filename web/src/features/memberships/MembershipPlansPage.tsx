import { useState } from "react";
import { useMembershipPlans, useCreateMembershipPlan } from "./useMemberships";
import { useAuth } from "../../auth/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export function MembershipPlansPage() {
  const { data: plans, isLoading } = useMembershipPlans();
  const createPlan = useCreateMembershipPlan();
  const { role } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: 0, durationDays: 30 });

  if (isLoading) return <p className="p-6">Cargando...</p>;

  async function handleCreate() {
    await createPlan.mutateAsync(form);
    setForm({ name: "", description: "", price: 0, durationDays: 30 });
    setShowForm(false);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Planes de membresía</h1>
        {role === "ADMIN" && (
          <Button onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancelar" : "+ Nuevo plan"}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-6 max-w-md space-y-3">
          <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input
            label="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Precio"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
          <Input
            label="Duración (días)"
            type="number"
            value={form.durationDays}
            onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
          />
          <Button onClick={handleCreate}>Guardar plan</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans?.map((p) => (
          <div key={p.id} className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-slate-500 mb-2">{p.description}</p>
            <p className="text-lg font-semibold">${p.price.toLocaleString("es-CO")}</p>
            <p className="text-xs text-slate-400">{p.durationDays} días</p>
          </div>
        ))}
      </div>
    </div>
  );
}