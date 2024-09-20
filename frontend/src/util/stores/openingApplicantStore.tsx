import { create } from "zustand";

interface OpeningStore {
  round_id: number | null;
  opening_id: number | null;
  setOpeningDetails: (round_id: number, opening_id: number) => void;
  clearOpeningDetails: () => void;
}

export const useOpeningStore = create<OpeningStore>((set) => ({
  round_id: null,
  opening_id: null,
  setOpeningDetails: (round_id, opening_id) => set({ round_id, opening_id }),
  clearOpeningDetails: () => set({ round_id: null, opening_id: null }),
}));
