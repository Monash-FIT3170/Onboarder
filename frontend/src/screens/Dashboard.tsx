import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import {
  DashboardTable,
  StudentTeamResultProps,
} from "../components/DashboardTable";
import styled from "styled-components";
import AddTeamModal from "./AddTeamModal";
import { useAuthStore } from "../util/stores/authStore";
import { useStudentTeamStore } from "../util/stores/studentTeamStore";
import axios, { AxiosError } from "axios";
import { getBaseAPIURL } from "../util/Util";

const TitleWrap = styled.div`
  margin: auto;
  text-align: center;
`;

const ButtonStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

interface ErrorState {
  message: string;
  severity: "error" | "warning" | "info" | "success";
}

const Dashboard: React.FC = () => {
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const BASE_API_URL = getBaseAPIURL();
  const authStore = useAuthStore();
  const { studentTeams, setStudentTeams } = useStudentTeamStore();

  const { user, profile } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // let profileId: string | null = "1"; // Replace with actual profile id fetching logic, this is for demo only (delete this line and uncomment below line)
        setLoading(true);
        let profileId = profile;

        if (!profileId) {
          profileId = await authStore.fetchProfile();
        }

        if (!profileId) {
          throw new Error("Failed to fetch profile ID");
        }

        const rolesResponse = await axios.get(
          `${BASE_API_URL}/profile/${profileId}/student-teams`,
        );

        const tableData = rolesResponse.data
          .map((role: any) => ({
            id: role.profile_id,
            student_team_id: role.student_team_id,
            student_team_name: role.student_team_name,
            user_team_role:
              role.your_role === "O"
                ? "Owner"
                : role.your_role === "A"
                  ? "Admin"
                  : "Team Lead",
            student_team_owner: role.owner_email,
            student_team_description: role.student_team_description,
            student_team_meeting_link: role.student_team_meeting_link,
          }))
          .sort((a: StudentTeamResultProps, b: StudentTeamResultProps) => {
            const roleRanking: { [key: string]: number } = {
              Owner: 0,
              Admin: 1,
              "Team Lead": 2,
            };
            return (
              roleRanking[a.user_team_role] - roleRanking[b.user_team_role]
            );
          });

        setStudentTeams(tableData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError({
          message: "Failed to fetch student teams. Please try again later.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAddTeamModalOpen, BASE_API_URL, authStore, profile, setStudentTeams]);

  const handleAddTeamClick = () => {
    setIsAddTeamModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddTeamModalOpen(false);
  };

  const handleSubmitTeam = async (
    teamName: string,
    teamDescription: string,
  ) => {
    try {
      if (!teamName.trim() || !teamDescription.trim()) {
        throw new Error("Team name and description are required.");
      }

      const response = await axios.post(`${BASE_API_URL}/student-team`, {
        name: teamName,
        description: teamDescription,
      });

      const newTeamId = response.data.data[0].id;

      await axios.post(`${BASE_API_URL}/student-team/${newTeamId}/members`, {
        email: user.email,
        role: "O",
      });

      const newStudentTeam = {
        id: newTeamId,
        student_team_id: newTeamId,
        student_team_name: teamName,
        user_team_role: "Owner",
        student_team_owner: user.email,
        student_team_description: teamDescription,
        student_team_meeting_link: "", // TODO: Add meeting link
      };

      setStudentTeams([...studentTeams, newStudentTeam]);
      setError({
        message: "Team created successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error submitting team:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        setError({
          message:
            axiosError.response?.data?.message ||
            "Failed to create team. Please try again.",
          severity: "error",
        });
      } else {
        setError({
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
          severity: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <Box display="flex" flexDirection="column">
      <TitleWrap>
        <Typography variant="h2" fontWeight="light" gutterBottom>
          Dashboard
        </Typography>
      </TitleWrap>
      <ButtonStyle>
        <Typography variant="h4">Your Student Teams</Typography>
        <Button variant="contained" onClick={handleAddTeamClick}>
          Add Team
        </Button>
      </ButtonStyle>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <DashboardTable results={studentTeams} />
      )}
      <AddTeamModal
        open={isAddTeamModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTeam}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error?.severity}
          sx={{ width: "100%" }}
        >
          {error?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
