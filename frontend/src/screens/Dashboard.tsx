import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  DashboardTable,
  StudentTeamResultProps,
} from "../components/DashboardTable";
import styled from "styled-components";
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

  const { user, profile } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let profileId: string | null = "1"; // Replace with actual profile id fetching logic, this is for demo only (delete this line and uncomment below line)
        // let profileId = profile;

        if (!profileId) {
          profileId = await authStore.fetchProfile();
        }

        const rolesResponse = await axios.get(
          `http://127.0.0.1:3000/profile/${profileId}/student-teams` // Working
        );
        console.log(rolesResponse.data);
        const tableData = rolesResponse.data
          .map((role: any) => ({
            id: role.profile_id, // Assuming the API returns a user id
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
        console.log(tableData);

        setStudentTeams(tableData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAddTeamModalOpen]);

  const handleAddTeamClick = () => {
    setIsAddTeamModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddTeamModalOpen(false);
  };

  const handleSubmitTeam = async (
    teamName: string,
    teamDescription: string
  ) => {
    try {
      const response = await axios.post("http://127.0.0.1:3000/student-team", {
        name: teamName,
        description: teamDescription,
      });

      const newTeamId = response.data.data[0].id;

      await axios.post(
        `http://127.0.0.1:3000/student-team/${newTeamId}/members`,
        {
          email: user.email,
          role: "O",
        }
      );

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

export default Dashboard;
