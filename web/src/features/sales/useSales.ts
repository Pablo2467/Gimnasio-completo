import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesApi } from "../../api/sales";
import type { SaleRequest } from "../../types";

export function useSales() {
  return useQuery({ queryKey: ["sales"], queryFn: salesApi.findAll });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SaleRequest) => salesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}