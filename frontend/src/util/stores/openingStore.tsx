import { create } from "zustand";

interface OpeningDetails {
  id: number | null;
  recruitment_round_id: number | null;
  student_team_name: string | null;
  title: string | null;
  application_count: number | null;
  description?: string | null;
  status?: string | null;
  required_skills?: string[] | null;
  desired_skills?: string[] | null;
  task_email_format?: string | null;
  task_enabled?: boolean | null;
  interview_allocation_status?: string | null;
  calendar_invites_sent?: boolean | null;
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
    description: null,
    status: null,
    required_skills: null,
    desired_skills: null,
    task_email_format: null,
    task_enabled: null,
    interview_allocation_status: null,
    calendar_invites_sent: null,
  },
  setSelectedOpening: (opening) => set({ selectedOpening: opening }),
  clearSelectedOpening: () => set({ selectedOpening: null }),
}));
