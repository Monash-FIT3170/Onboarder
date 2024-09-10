import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import {
  DashboardTable,
  StudentTeamResultProps,
} from "../components/DashboardTable";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AddTeamModal from "./AddTeamModal";
import { useAuthStore } from "../util/stores/authStore";
import { useStudentTeamStore } from "../util/stores/studentTeamStore";
import axios from "axios";

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

const Dashboard: React.FC = () => {
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const authStore = useAuthStore();
  const { studentTeams, setStudentTeams } = useStudentTeamStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let profile_id = 1; // Replace with actual profile_id fetching logic

        if (!profile_id) {
          profile_id = await authStore.fetchProfile();
        }

        const rolesResponse = await axios.get(
          `http://127.0.0.1:3000/studentTeams/${profile_id}`
        );

        const tableData = rolesResponse.data
          .map((role: any) => ({
            id: role.id, // Assuming the API returns a user id
            student_team_id: role.student_team_id,
            student_team_name: role.student_team_name,
            user_team_role:
              role.your_role === "O"
                ? "Owner"
                : role.your_role === "A"
                ? "Admin"
                : "Team Lead",
            student_team_owner: role.owner_email,
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setStudentTeams, authStore]);

  const handleAddTeamClick = () => {
    setIsAddTeamModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddTeamModalOpen(false);
  };

  const handleSubmitTeam = (teamName: string, teamDescription: string) => {
    // TODO: Implement team creation logic
    console.log("Team created:", { teamName, teamDescription });
    // You might want to update the studentTeams or fetch new data here
  };

  return (
    <Box display="flex" flexDirection="column">
      <TitleWrap>
        <Typography variant="h2" fontWeight="light" gutterBottom>
          Student Team
        </Typography>
      </TitleWrap>
      <ButtonStyle>
        <Typography variant="h4">Your student teams</Typography>
        <Button variant="contained" onClick={handleAddTeamClick}>
          Add Team
        </Button>
      </ButtonStyle>
      <DashboardTable results={studentTeams} />
      <AddTeamModal
        open={isAddTeamModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTeam}
      />
    </Box>
  );
};

export default Dashboard;
