import { create } from "zustand";
import { supabase } from "../supabaseClient";
import { UserRole } from "../Util";

interface AuthState {
	user: any | null;
	loading: boolean;
	team: string | null;
	role: UserRole | null;
	initializeAuth: () => Promise<void>;
	signOut: () => Promise<void>;
	checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	loading: true,
	team: null,
	role: null,
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
	updateTeamAndRole: (team: string | null, role: UserRole | null) => {
		set({ team, role });
	},
}));
