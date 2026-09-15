import client from "./client";
import type { Membership, MembershipPlan, MembershipPlanRequest, MembershipRequest } from "../types";

export const membershipPlansApi = {
  findAll: () => client.get<MembershipPlan[]>("/membership-plans").then((r) => r.data),
  create: (data: MembershipPlanRequest) =>
    client.post<MembershipPlan>("/membership-plans", data).then((r) => r.data),
  update: (id: number, data: MembershipPlanRequest) =>
    client.put<MembershipPlan>(`/membership-plans/${id}`, data).then((r) => r.data),
  deactivate: (id: number) => client.delete(`/membership-plans/${id}`),
};

export const membershipsApi = {
  findByMember: (memberId: number) =>
    client.get<Membership[]>(`/members/${memberId}/memberships`).then((r) => r.data),
  create: (memberId: number, data: MembershipRequest) =>
    client.post<Membership>(`/members/${memberId}/memberships`, data).then((r) => r.data),
  findById: (id: number) => client.get<Membership>(`/memberships/${id}`).then((r) => r.data),
  cancel: (id: number) => client.post(`/memberships/${id}/cancel`), // [ADMIN]
};