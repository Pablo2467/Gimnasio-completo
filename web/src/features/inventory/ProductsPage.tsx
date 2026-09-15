// features/inventory/ProductsPage.tsx
import { useState } from "react";
import { useProducts, useCreateProduct, useDeleteProduct } from "./useProducts";
import { useAuth } from "../../auth/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const { role } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", price: 0, stock: 0, description: "" });

  if (isLoading) return <p className="p-6">Cargando...</p>;

  async function handleCreate() {
    await createProduct.mutateAsync(form);
    setForm({ name: "", category: "", price: 0, stock: 0, description: "" });
    setShowForm(false);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Productos</h1>
        {role === "ADMIN" && (
          <Button onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancelar" : "+ Nuevo producto"}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-6 max-w-md space-y-3">
          <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input
            label="Precio"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
          <Input
            label="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          />
          <Button onClick={handleCreate}>Guardar producto</Button>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b text-sm text-slate-600">
            <th className="py-2">Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => (
            <tr key={p.id} className="border-b text-sm">
              <td className="py-2">{p.name}</td>
              <td>{p.category}</td>
              <td>${p.price.toLocaleString("es-CO")}</td>
              <td>
                <span className={p.stock === 0 ? "text-red-600" : ""}>{p.stock}</span>
              </td>
              <td className="text-right">
                {role === "ADMIN" && (
                  <button onClick={() => deleteProduct.mutate(p.id)} className="text-sm text-red-600">
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}