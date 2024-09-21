import { create } from "zustand";
import { supabase } from "../supabaseClient";
import { UserRole } from "../Util";

interface AuthState {
  user: any | null;
  profile: any | null;
  loading: boolean;
  team_id: any | null;
  team_name: string | null;
  role: UserRole | null;
  initializeAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  fetchProfile: () => Promise<string | null>;
  updateTeamAndRole(
    team_id: any | null,
    team_name: string | null,
    role: string | null,
  ): void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  team_id: null,
  team_name: null,
  role: null,

  initializeAuth: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({ user: session?.user ?? null });

    // Get the profile id from the PROFILE table
    const { data: profileData, error: profileError } = await supabase
      .from("PROFILE")
      .select("id")
      .eq("user_id", session?.user?.id);

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    } else {
      const profileId = profileData?.[0]?.id ?? null;
      set({ profile: profileId, loading: false });
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

  updateTeamAndRole: (
    team_id: any | null,
    team_name: string | null,
    role: UserRole | null,
  ) => {
    set({ team_id, team_name, role });
  },

  fetchProfile: async (): Promise<string | null> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      console.error("No user session found");
      set({ loading: false });
      return null;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("PROFILE")
      .select("id")
      .eq("user_id", session.user.id);

    if (profileError) {
      set({ loading: false });
      return null;
    } else {
      const profileId = profileData?.[0]?.id ?? null;
      set({ profile: profileId, loading: false });
      return profileId;
    }
  },
}));
