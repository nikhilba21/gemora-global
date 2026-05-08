import { Skeleton } from "@/components/ui/skeleton";
import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";

const API_BASE = (import.meta as { env: Record<string, string> }).env?.VITE_API_URL
  || 'https://gemora-global-2.onrender.com';

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Quick check: if sessionStorage says we're logged in, allow immediately
    const session = sessionStorage.getItem("adminSession");
    if (session === "true") {
      setIsAdmin(true);
      setChecked(true);
      return;
    }

    // 2. If no session, check if we have a persisted token in localStorage
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setIsAdmin(false);
      setChecked(true);
      return;
    }

    // 3. Verify the token with the backend
    fetch(`${API_BASE}/api/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (res.ok) {
          // Token is valid — restore session
          sessionStorage.setItem("adminSession", "true");
          sessionStorage.setItem("adminToken", token);
          setIsAdmin(true);
        } else {
          // Token expired or invalid — clean up
          localStorage.removeItem("admin_token");
          setIsAdmin(false);
        }
      })
      .catch(() => {
        // Network error — still allow if token exists (offline tolerance)
        setIsAdmin(false);
      })
      .finally(() => setChecked(true));
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
