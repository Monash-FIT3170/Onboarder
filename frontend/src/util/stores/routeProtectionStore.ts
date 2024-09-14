import { create } from "zustand";

interface RouteProtectionState {
  isProtectedRoute: boolean;
  setIsProtectedRoute: (isProtected: boolean) => void;
}

export const useRouteProtectionStore = create<RouteProtectionState>((set) => ({
  isProtectedRoute: false,
  setIsProtectedRoute: (isProtected) => set({ isProtectedRoute: isProtected }),
}));
