import { create } from 'zustand';

interface RecruitmentStore {
  selectedRecruitmentRoundId: number | null;
  setSelectedRecruitmentRoundId: (id: number) => void;
}

export const useRecruitmentStore = create<RecruitmentStore>((set) => ({
  selectedRecruitmentRoundId: null,
  setSelectedRecruitmentRoundId: (id) => set({ selectedRecruitmentRoundId: id }),
}));