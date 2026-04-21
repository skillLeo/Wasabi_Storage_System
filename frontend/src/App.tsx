import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import UsersPage from "@/pages/admin/UsersPage";
import UserDetailPage from "@/pages/admin/UserDetailPage";
import SlotsPage from "@/pages/admin/SlotsPage";
import EmployeeLayout from "@/pages/employee/EmployeeLayout";
import DocumentsPage from "@/pages/employee/DocumentsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:id" element={<UserDetailPage />} />
        <Route path="slots" element={<SlotsPage />} />
      </Route>

      <Route path="/employee" element={<EmployeeLayout />}>
        <Route index element={<Navigate to="/employee/documents" replace />} />
        <Route path="documents" element={<DocumentsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
