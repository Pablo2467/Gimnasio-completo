import client from "./client";
import type { Payment, PaymentRequest } from "../types";

export const paymentsApi = {
  create: (data: PaymentRequest) => client.post<Payment>("/payments", data).then((r) => r.data),
};