import { create } from "zustand";

interface MemberDetails {
  id: number | null;
  email: string | null;
}

interface MemberStore {
  selectedMember: MemberDetails | null;
  setSelectedMember: (member: MemberDetails) => void;
  clearSelectedMember: () => void;
}

export const useMemberStore = create<MemberStore>((set) => ({
  selectedMember: null,
  setSelectedMember: (member) => set({ selectedMember: member }),
  clearSelectedMember: () => set({ selectedMember: null }),
}));
