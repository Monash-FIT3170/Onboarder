import { create } from "zustand";

interface ApplicantDetails {
  opening_name: string | null;
  recruitment_round_name: string | null;
  application_id: number | null;
  opening_id: number | null;
  recruitment_round_id: number | null;
  student_team_name: string | null;
  opening_title: string | null;
  application_count: number | null;
}

interface ApplicantStore {
  selectedApplicant: ApplicantDetails | null;
  setSelectedApplicant: (applicant: ApplicantDetails) => void;
  clearSelectedApplicant: () => void;
}

export const useApplicantStore = create<ApplicantStore>((set) => ({
  selectedApplicant: null,
  setSelectedApplicant: (applicant) => set({ selectedApplicant: applicant }),
  clearSelectedApplicant: () => set({ selectedApplicant: null }),
}));
