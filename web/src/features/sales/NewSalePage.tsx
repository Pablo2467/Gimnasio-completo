import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../inventory/useProducts";
import { useCreateSale } from "./useSales";
import { Button } from "../../components/ui/Button";
import type { AxiosError } from "axios";
import type { ApiError } from "../../types";

interface CartItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export function NewSalePage() {
  const { data: products, isLoading } = useProducts();
  const createSale = useCreateSale();
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  function addToCart(productId: number, name: string, price: number) {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { productId, name, price, quantity: 1 }];
    });
  }

  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function handleConfirm() {
    setError(null);
    try {
      const sale = await createSale.mutateAsync({
        items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      navigate(`/sales`, { state: { createdSaleId: sale.id } });
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      setError(axiosErr.response?.data?.message ?? "No se pudo registrar la venta");
    }
  }

  if (isLoading) return <p className="p-6">Cargando productos...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-xl font-semibold mb-4">Productos</h1>
        <div className="space-y-2">
          {products?.map((p) => (
            <div key={p.id} className="flex justify-between items-center border rounded p-3">
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-slate-500">
                  ${p.price.toLocaleString("es-CO")} · stock: {p.stock}
                </p>
              </div>
              <Button
                onClick={() => addToCart(p.id, p.name, p.price)}
                disabled={p.stock === 0}
              >
                Agregar
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Carrito</h2>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {cart.length === 0 && <p className="text-slate-400 text-sm">Sin productos agregados</p>}
        <div className="space-y-2 mb-4">
          {cart.map((i) => (
            <div key={i.productId} className="flex justify-between items-center border rounded p-3">
              <span className="text-sm">
                {i.name} × {i.quantity}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">${(i.price * i.quantity).toLocaleString("es-CO")}</span>
                <button onClick={() => removeFromCart(i.productId)} className="text-red-600 text-xs">
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 flex justify-between items-center mb-4">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">${total.toLocaleString("es-CO")}</span>
        </div>
        <Button onClick={handleConfirm} disabled={cart.length === 0 || createSale.isPending}>
          Confirmar venta
        </Button>
      </div>
    </div>
  );
}