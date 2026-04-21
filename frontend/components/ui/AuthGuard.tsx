"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "./Spinner";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole: "admin" | "employee";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      window.location.replace("/");
      return;
    }
    if (user.role !== requiredRole) {
      window.location.replace(user.role === "admin" ? "/admin/dashboard" : "/employee/documents");
    }
  }, [user, loading, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || user.role !== requiredRole) return null;

  return <>{children}</>;
}
