import React from "react";
import { ShieldAlert } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function AdminRoute() {
  const { user, isAuthenticated, isLoadingAuth, authChecked } = useAuth();

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
        <ShieldAlert className="w-12 h-12 text-destructive" />
        <h1 className="font-heading text-2xl font-bold">Access denied</h1>
        <p className="text-muted-foreground">This area is restricted to shop administrators.</p>
      </div>
    );
  }

  return <Outlet />;
}