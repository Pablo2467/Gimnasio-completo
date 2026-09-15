import client from "./client";
import type { Member, MemberRequest } from "../types";

export const membersApi = {
  findAll: () => client.get<Member[]>("/members").then((r) => r.data),
  findById: (id: number) => client.get<Member>(`/members/${id}`).then((r) => r.data),
  create: (data: MemberRequest) => client.post<Member>("/members", data).then((r) => r.data),
  update: (id: number, data: MemberRequest) =>
    client.put<Member>(`/members/${id}`, data).then((r) => r.data),
  deactivate: (id: number) => client.delete(`/members/${id}`),
};