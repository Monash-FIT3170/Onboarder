import { create } from "zustand";

export interface StudentTeam {
  id: number; // user id
  student_team_id: number;
  student_team_name: string;
  user_team_role: string;
  student_team_owner: string;
  student_team_description: string;
  student_team_meeting_link: string;
}

interface StudentTeamStore {
  studentTeams: StudentTeam[];
  setStudentTeams: (teams: StudentTeam[]) => void;
  addStudentTeam: (team: StudentTeam) => void;
  removeStudentTeam: (id: number) => void;
}

export const useStudentTeamStore = create<StudentTeamStore>((set) => ({
  studentTeams: [],
  setStudentTeams: (teams) => set({ studentTeams: teams }),
  addStudentTeam: (team) =>
    set((state) => ({ studentTeams: [...state.studentTeams, team] })),
  removeStudentTeam: (id) =>
    set((state) => ({
      studentTeams: state.studentTeams.filter((team) => team.id !== id),
    })),
}));
