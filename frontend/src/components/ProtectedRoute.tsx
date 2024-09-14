// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../util/stores/authStore";
import { useRouteProtectionStore } from "../util/stores/routeProtectionStore";
import { useEffect } from "react";
import LoadingSpinner from "./LoadSpinner";

const ProtectedRoute = () => {
  const { user, loading, initializeAuth, checkSession } = useAuthStore();
  const setIsProtectedRoute = useRouteProtectionStore(
    (state) => state.setIsProtectedRoute
  );
  const location = useLocation();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Check session on every route change
    checkSession();
  }, [location, checkSession]);

  useEffect(() => {
    setIsProtectedRoute(true);
    return () => setIsProtectedRoute(false);
  }, [setIsProtectedRoute]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
