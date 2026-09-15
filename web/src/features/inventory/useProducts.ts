// features/inventory/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../../api/products";
import type { ProductRequest } from "../../types";

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: productsApi.findAll });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductRequest) => productsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}