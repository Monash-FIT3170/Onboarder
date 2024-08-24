import { create } from "zustand";
import { supabase } from "../supabaseClient";
import { UserRole } from "../Util";

interface AuthState {
	user: any | null;
	profile: any | null;
	loading: boolean;
	team: string | null;
	role: UserRole | null;
	initializeAuth: () => Promise<void>;
	signOut: () => Promise<void>;
	checkSession: () => Promise<void>;
}


export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	profile: null,
	loading: true,
	team: null,
	role: null,

	initializeAuth: async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		set({ user: session?.user ?? null, loading: false });

		// Get the profile id from the PROFILE table
		const { data: profileData, error: profileError } = await supabase
			.from("PROFILE")
			.select("id")
			.eq("user_id", session?.user?.id);

		if (profileError) {
			console.error("Error fetching profile:", profileError);
		} else {
			const profileId = profileData?.[0]?.id ?? null;
			set({ profile: profileId });
		}

		supabase.auth.onAuthStateChange(async (_, session) => {
			if (session?.user) {
				set({ user: session?.user ?? null, loading: false });
			}
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
