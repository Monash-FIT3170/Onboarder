import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DashboardTable } from "../components/DashboardTable";
import styled from "styled-components";
import AddTeamModal from "../components/AddTeamModal";
import { useAuthStore } from "../util/stores/authStore";
import { useStudentTeamStore } from "../util/stores/studentTeamStore";
import axios from "axios";
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

const DashboardPage: React.FC = () => {
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const BASE_API_URL = getBaseAPIURL();
  const { studentTeams, setStudentTeams } = useStudentTeamStore();

  const { user } = useAuthStore();

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
      };

      setStudentTeams([...studentTeams, newStudentTeam]);
    } catch (error) {
      console.error("Error submitting team:", error);
    }
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
      <DashboardTable results={studentTeams} />
      <AddTeamModal
        open={isAddTeamModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTeam}
      />
    </Box>
  );
};

export default DashboardPage;
