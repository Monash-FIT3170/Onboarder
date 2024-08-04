import { create } from 'zustand';

// interface RecruitmentStore {
//   selectedRecruitmentRoundId: number | null;
//   setSelectedRecruitmentRoundId: (id: number) => void;
// }

// export const useRecruitmentStore = create<RecruitmentStore>((set) => ({
//   selectedRecruitmentRoundId: null,
//   setSelectedRecruitmentRoundId: (id) => set({ selectedRecruitmentRoundId: id }),
// }));

interface RecruitmentDetails {
  roundId: number | null;
  roundDeadline: string | null;
  roundName: string | null;
}

interface RecruitmentStore {
  recruitmentDetails: RecruitmentDetails;
  setRecruitmentDetails: (details: RecruitmentDetails) => void;
}

export const useRecruitmentStore = create<RecruitmentStore>((set) => ({
  recruitmentDetails: {
    roundId: null,
    roundDeadline: null,
    roundName: null,
  },
  setRecruitmentDetails: (details) => set({ recruitmentDetails: details }),
}));