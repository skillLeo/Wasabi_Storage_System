import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "./Spinner";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole: "admin" | "employee";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== requiredRole) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/employee/documents"} replace />;
  }

  return <>{children}</>;
}
