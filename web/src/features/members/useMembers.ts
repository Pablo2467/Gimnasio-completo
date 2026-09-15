import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "../../api/members";
import type { MemberRequest } from "../../types";

export function useMembers() {
  return useQuery({ queryKey: ["members"], queryFn: membersApi.findAll });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MemberRequest) => membersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useDeactivateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => membersApi.deactivate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}