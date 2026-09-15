import axios from "axios";
import type { ApiError } from "../types";

export function getErrorMessage(
  error: unknown,
  fallback = "Algo no funcionó. Intenta de nuevo."
): string {
  if (axios.isAxiosError<ApiError>(error)) {
    if (error.response?.data?.message) return error.response.data.message;
    if (!error.response) return "No hay conexión con el servidor.";
  }
  return fallback;
}