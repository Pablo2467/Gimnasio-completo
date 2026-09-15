import client from "./client";
import type { Sale, SaleRequest } from "../types";

export const salesApi = {
  findAll: () => client.get<Sale[]>("/sales").then((r) => r.data),
  findById: (id: number) => client.get<Sale>(`/sales/${id}`).then((r) => r.data),
  create: (data: SaleRequest) => client.post<Sale>("/sales", data).then((r) => r.data),
  cancel: (id: number) => client.post(`/sales/${id}/cancel`), // [ADMIN]
};