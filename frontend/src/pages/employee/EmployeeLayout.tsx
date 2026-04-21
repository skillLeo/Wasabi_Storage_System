import { Outlet } from "react-router-dom";
import AuthGuard from "@/components/ui/AuthGuard";
import Navbar from "@/components/ui/Navbar";

export default function EmployeeLayout() {
  return (
    <AuthGuard requiredRole="employee">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  );
}
