import client from "./client";
import type { Product, ProductRequest } from "../types";

export const productsApi = {
  findAll: () => client.get<Product[]>("/products").then((r) => r.data),
  findById: (id: number) => client.get<Product>(`/products/${id}`).then((r) => r.data),
  create: (data: ProductRequest) => client.post<Product>("/products", data).then((r) => r.data),
  update: (id: number, data: ProductRequest) =>
    client.put<Product>(`/products/${id}`, data).then((r) => r.data),
  delete: (id: number) => client.delete(`/products/${id}`),
};