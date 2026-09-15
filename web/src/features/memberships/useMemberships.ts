import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipPlansApi, membershipsApi } from "../../api/memberships";
import type { MembershipPlanRequest, MembershipRequest } from "../../types";

export function useMembershipPlans() {
  return useQuery({ queryKey: ["membership-plans"], queryFn: membershipPlansApi.findAll });
}

export function useCreateMembershipPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MembershipPlanRequest) => membershipPlansApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["membership-plans"] }),
  });
}

export function useMemberMemberships(memberId: number) {
  return useQuery({
    queryKey: ["memberships", memberId],
    queryFn: () => membershipsApi.findByMember(memberId),
    enabled: !!memberId,
  });
}

export function useContractMembership(memberId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MembershipRequest) => membershipsApi.create(memberId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["memberships", memberId] }),
  });
}