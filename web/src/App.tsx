// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { LoginPage } from "./auth/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { MembersListPage } from "./features/members/MembersListPage";
import { MemberFormPage } from "./features/members/MemberFormPage";
import { MembershipPlansPage } from "./features/memberships/MembershipPlansPage";
import { MemberMembershipsPage } from "./features/memberships/MemberMembershipsPage";
import { ProductsPage } from "./features/inventory/ProductsPage";
import { NewSalePage } from "./features/sales/NewSalePage";
import { SalesListPage } from "./features/sales/SalesListPage";
import { AppLayout } from "./components/layout/AppLayout";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/members" element={<MembersListPage />} />
            <Route path="/members/new" element={<MemberFormPage />} />
            <Route path="/members/:id/edit" element={<MemberFormPage />} />
            <Route path="/members/:id/memberships" element={<MemberMembershipsPage />} />
            <Route path="/membership-plans" element={<MembershipPlansPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/sales" element={<SalesListPage />} />
            <Route path="/sales/new" element={<NewSalePage />} />
      </Route>
    </Route>
<Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}