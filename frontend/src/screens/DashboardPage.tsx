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
  const [newTeam, setNewTeam] = useState<any>(null);

  const { user } = useAuthStore();

  const handleAddTeamClick = () => {
    setIsAddTeamModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddTeamModalOpen(false);
  };

  const handleUserGuideClick = () => {
    window.open(
      "https://github.com/Monash-FIT3170/Onboarder/blob/main/USERGUIDE.md",
      "_blank",
    );
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
      setNewTeam(newStudentTeam);
    } catch (error) {
      console.error("Error submitting team:", error);
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <ButtonStyle>
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="contained" onClick={handleUserGuideClick}>
          User Guide
        </Button>
      </ButtonStyle>
      <ButtonStyle>
        <Typography variant="h5">Your Student Teams</Typography>
        <Button variant="contained" onClick={handleAddTeamClick}>
          Add Team
        </Button>
      </ButtonStyle>
      <DashboardTable newTeam={newTeam} />
      <AddTeamModal
        open={isAddTeamModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTeam}
      />
    </Box>
  );
};

export default DashboardPage;
