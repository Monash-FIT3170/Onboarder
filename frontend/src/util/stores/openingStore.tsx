import { create } from "zustand";

interface OpeningDetails {
  id: number | null;
  recruitment_round_id: number | null;
  student_team_name: string | null;
  title: string | null;
  application_count: number | null;
}

interface OpeningStore {
  selectedOpening: OpeningDetails | null;
  setSelectedOpening: (opening: OpeningDetails) => void;
  clearSelectedOpening: () => void;
}

export const useOpeningStore = create<OpeningStore>((set) => ({
  selectedOpening: {
    id: null,
    recruitment_round_id: null,
    student_team_name: null,
    title: null,
    application_count: null,
  },
  setSelectedOpening: (opening) => set({ selectedOpening: opening }),
  clearSelectedOpening: () => set({ selectedOpening: null }),
}));
