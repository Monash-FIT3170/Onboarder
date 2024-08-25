import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
} from "@mui/material";
import {
  DashboardTable,
  StudentTeamResultProps,
} from "../components/DashboardTable";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import JobInterviewIcon from "../assets/JobInterview.jpg";
import AddTeamModal from "./AddTeamModal";
import { useAuthStore } from "../util/stores/authStore";
import { useStudentTeamStore } from "../util/stores/studentTeamStore";
import axios from "axios";

const TitleWrap = styled.div`
  margin: auto;
  text-align: center;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  width: 100%;
`;

const StyledCard = styled(Card)`
  max-width: 250px;
  text-align: center;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
`;

const StyledCardMedia = styled(CardMedia)`
  height: 160px;
  width: 250px;
  object-fit: contain;
  padding: 16px;
`;

const ButtonStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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

        let tableData = rolesResponse.data
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

  const handleInterviewCardClick = () => {
    navigate("/availability-calendar-user");
  };

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
      <CardContainer>
        <StyledCard>
          <CardActionArea onClick={handleInterviewCardClick}>
            <StyledCardMedia image={JobInterviewIcon} />
            <CardContent>
              <Typography variant="h5" component="div">
                Interviews
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View interviews and manage your availability
              </Typography>
            </CardContent>
          </CardActionArea>
        </StyledCard>
      </CardContainer>
      <AddTeamModal
        open={isAddTeamModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTeam}
      />
    </Box>
  );
};

export default Dashboard;
