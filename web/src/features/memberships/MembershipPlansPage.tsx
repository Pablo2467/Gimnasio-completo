// features/memberships/MembershipPlansPage.tsx
import { useState } from "react";
import {
  useMembershipPlans,
  useCreateMembershipPlan,
  useUpdateMembershipPlan,
  useDeactivateMembershipPlan,
} from "./useMemberships";
import { useAuth } from "../../auth/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PlanCard } from "./PlanCard";
import { useToast } from "../../components/ui/ToastProvider";
import { getErrorMessage } from "../../api/errors";
import type { MembershipPlan } from "../../types";

const emptyForm = { name: "", description: "", price: 0, durationDays: 30, imageUrl: "" };

export function MembershipPlansPage() {
  const { data: plans, isLoading } = useMembershipPlans();
  const createPlan = useCreateMembershipPlan();
  const updatePlan = useUpdateMembershipPlan();
  const deactivatePlan = useDeactivateMembershipPlan();
  const { role } = useAuth();
  const { notify } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  if (isLoading) return <p className="text-sm text-iron-400">Cargando planes…</p>;

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(plan: MembershipPlan) {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      description: plan.description ?? "",
      price: plan.price,
      durationDays: plan.durationDays,
      imageUrl: plan.imageUrl ?? "",
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    try {
      if (editingId !== null) {
        await updatePlan.mutateAsync({ id: editingId, data: form });
        notify("Plan actualizado", "success");
      } else {
        await createPlan.mutateAsync(form);
        notify("Plan creado", "success");
      }
      closeForm();
    } catch (e) {
      notify(getErrorMessage(e));
    }
  }

  function handleDelete(plan: MembershipPlan) {
    if (!confirm(`¿Eliminar el plan "${plan.name}"?`)) return;
    deactivatePlan.mutate(plan.id, {
      onSuccess: () => notify(`${plan.name} eliminado`, "success"),
      onError: (e) => notify(getErrorMessage(e)),
    });
  }

  const isSaving = createPlan.isPending || updatePlan.isPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Planes de membresía</h1>
        {role === "ADMIN" && (
          <Button onClick={showForm ? closeForm : openCreateForm}>
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
          <Button onClick={handleSave} disabled={isSaving}>
            {editingId !== null ? "Guardar cambios" : "Guardar plan"}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans?.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            canManage={role === "ADMIN"}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}