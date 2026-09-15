// features/inventory/ProductsPage.tsx
import { useState } from "react";
import { useProducts, useCreateProduct, useDeleteProduct } from "./useProducts";
import { useAuth } from "../../auth/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { DataTable } from "../../components/ui/DataTable";
import { useToast } from "../../components/ui/ToastProvider";
import { getErrorMessage } from "../../api/errors";
import type { Product } from "../../types";

const COP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const LOW_STOCK_THRESHOLD = 5;

export function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const { role } = useAuth();
  const { notify } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", price: 0, stock: 0, description: "", imageUrl: "" });

  if (isLoading) return <p className="text-sm text-iron-400">Cargando productos…</p>;

  async function handleCreate() {
    await createProduct.mutateAsync(form);
    setForm({ name: "", category: "", price: 0, stock: 0, description: "", imageUrl: "" });
    setShowForm(false);
  }

  function handleDelete(product: Product) {
    if (!confirm(`¿Eliminar ${product.name}?`)) return;
    deleteProduct.mutate(product.id, {
      onSuccess: () => notify(`${product.name} eliminado`, "success"),
      onError: (e) => notify(getErrorMessage(e)),
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Productos</h1>
        {role === "ADMIN" && (
          <Button onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancelar" : "Nuevo producto"}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-iron-200 p-5 mb-6 max-w-md space-y-3">
          <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input label="Precio" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          <Input label="URL de imagen" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <Button onClick={handleCreate}>Guardar producto</Button>
        </div>
      )}

      <DataTable
        rows={products}
        rowKey={(p) => p.id}
        searchPlaceholder="Buscar por nombre o categoría…"
        searchValue={(p) => `${p.name} ${p.category ?? ""}`}
        empty="Aún no hay productos registrados."
        columns={[
          {
            header: "Producto",
            sortValue: (p) => p.name,
            cell: (p) => (
              <div className="flex items-center gap-3">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt="" loading="lazy" className="h-9 w-9 object-cover rounded-sm border border-iron-200 shrink-0" />
                ) : (
                  <div className="h-9 w-9 shrink-0 rounded-sm bg-iron-50 border border-iron-200 flex items-center justify-center text-xs font-semibold text-iron-400">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium">{p.name}</span>
              </div>
            ),
          },
          { header: "Categoría", sortValue: (p) => p.category ?? "", cell: (p) => <span className="text-iron-700">{p.category}</span> },
          {
            header: "Precio",
            align: "right",
            sortValue: (p) => p.price,
            cell: (p) => <span className="tabular">{COP.format(p.price)}</span>,
          },
          {
            header: "Stock",
            align: "right",
            sortValue: (p) => p.stock,
            cell: (p) => (
              <span className={`tabular font-medium ${p.stock === 0 ? "text-plate-red" : p.stock <= LOW_STOCK_THRESHOLD ? "text-plate-amber" : ""}`}>
                {p.stock}
                {p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0 && (
                  <span className="ml-1.5 text-xs font-normal text-plate-amber">bajo</span>
                )}
              </span>
            ),
          },
          {
            header: "",
            align: "right",
            cell: (p) =>
              role === "ADMIN" && (
                <button onClick={() => handleDelete(p)} className="text-sm text-plate-red hover:underline">
                  Eliminar
                </button>
              ),
          },
        ]}
      />
    </div>
  );
}