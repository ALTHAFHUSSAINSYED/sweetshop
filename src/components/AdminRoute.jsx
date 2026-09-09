import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function AdminRoute() {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  const isLocalStorageAuthed =
    typeof window !== "undefined" &&
    localStorage.getItem("palnadu_admin_auth") === "true";

  if (isLoadingAuth && !isLocalStorageAuthed) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated && !isLocalStorageAuthed) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}