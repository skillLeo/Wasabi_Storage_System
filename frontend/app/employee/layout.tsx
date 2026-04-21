"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import Navbar from "@/components/ui/Navbar";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="employee">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
