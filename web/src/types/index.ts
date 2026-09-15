export type Role = "ADMIN" | "RECEPCIONISTA";

export type MemberStatus = "ACTIVE" | "INACTIVE";
export interface Member {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  documentId: string;
  status: MemberStatus;
  createdAt: string; 
}
export interface MemberRequest {
  fullName: string;
  email: string;
  phone?: string;
  documentId: string;
}

export interface MembershipPlan {
  id: number;
  name: string;
  description: string | null;
  price: number;
  durationDays: number;
  active: boolean;
}
export interface MembershipPlanRequest {
  name: string;
  description?: string;
  price: number;
  durationDays: number;
}

export type MembershipStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";
export interface Membership {
  id: number;
  memberId: number;
  memberName: string;
  planName: string;
  startDate: string; // LocalDate -> "YYYY-MM-DD"
  endDate: string;
  status: MembershipStatus;
}
export interface MembershipRequest {
  planId: number;
}

export interface Product {
  id: number;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  description: string | null;
}
export interface ProductRequest {
  name: string;
  category?: string;
  price: number;
  stock: number;
  description?: string;
}

export type SaleStatus = "COMPLETED" | "CANCELLED";
export interface SaleItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
export interface Sale {
  id: number;
  memberId: number | null;
  memberName: string | null;
  employeeEmail: string;
  status: SaleStatus;
  total: number;
  items: SaleItemResponse[];
  createdAt: string;
}
export interface SaleRequest {
  memberId?: number | null;
  items: { productId: number; quantity: number }[];
}

export type PaymentMethod = "CASH" | "CARD" | "TRANSFER";
export type PaymentStatus = "PENDING" | "COMPLETED" | "REFUNDED";
export interface PaymentRequest {
  membershipId: number;
  amount: number;
  method: PaymentMethod;
}
export interface Payment {
  id: number;
  membershipId: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt: string;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}

export interface DashboardSummary {
  activeMembers: number;
  activeMemberships: number;
  revenueThisMonth: number;
  salesToday: number;
}