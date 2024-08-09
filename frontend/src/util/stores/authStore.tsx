import { create } from "zustand";
import { supabase } from "../supabaseClient";

interface AuthState {
	user: any | null;
	loading: boolean;
	initializeAuth: () => Promise<void>;
	signOut: () => Promise<void>;
	checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	loading: true,
	initializeAuth: async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		set({ user: session?.user ?? null, loading: false });

		supabase.auth.onAuthStateChange((_, session) => {
			set({ user: session?.user ?? null, loading: false });
		});
	},

	signOut: async () => {
		await supabase.auth.signOut();
		set({ user: null });
	},
	checkSession: async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		set({ user: session?.user ?? null, loading: false });
	},
}));
