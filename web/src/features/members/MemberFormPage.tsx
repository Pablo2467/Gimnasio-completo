import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateMember } from "./useMembers";

const schema = z.object({
  fullName: z.string().min(1, "Requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  documentId: z.string().min(1, "Requerido"),
});
type FormData = z.infer<typeof schema>;

export function MemberFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const createMember = useCreateMember();
  const navigate = useNavigate();

  async function onSubmit(data: FormData) {
    await createMember.mutateAsync(data);
    navigate("/members");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-md space-y-3">
      <h1 className="text-xl font-semibold mb-4">Nuevo cliente</h1>
      <div>
        <input {...register("fullName")} placeholder="Nombre completo" className="w-full border rounded px-3 py-2" />
        {errors.fullName && <p className="text-red-600 text-xs">{errors.fullName.message}</p>}
      </div>
      <div>
        <input {...register("email")} placeholder="Email" className="w-full border rounded px-3 py-2" />
        {errors.email && <p className="text-red-600 text-xs">{errors.email.message}</p>}
      </div>
      <input {...register("phone")} placeholder="Teléfono" className="w-full border rounded px-3 py-2" />
      <div>
        <input {...register("documentId")} placeholder="Documento" className="w-full border rounded px-3 py-2" />
        {errors.documentId && <p className="text-red-600 text-xs">{errors.documentId.message}</p>}
      </div>
      <button className="bg-slate-900 text-white px-4 py-2 rounded">Guardar</button>
    </form>
  );
}