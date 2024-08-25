import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import TeamMembersTable, { TeamMember } from "../components/TeamMembersTable";
import InviteMemberModal from "./InviteMemberModal";
import axios from "axios";
import { useAuthStore } from "../util/stores/authStore";

const ViewTeamMembersPage: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { profile, team_id, team_name } = useAuthStore();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!profile) {
        setError("No profile selected");
        setIsLoading(false);
        return;
      }

      try {
        // First API call to get profile team info
        const profileTeamResponse = await axios.get(
          `http://127.0.0.1:3000/profileTeamInfo/${profile}`
        );
        const profileTeamInfo = profileTeamResponse.data;

        if (!profileTeamInfo || profileTeamInfo.length === 0) {
          throw new Error("Profile team information not found");
        }

        // Filter for the current team
        const currentTeamInfo = profileTeamInfo.find(
          (info: any) => info.student_team_id === team_id
        );

        if (!currentTeamInfo) {
          throw new Error("Current team information not found");
        }

        // Fetch student information for each member of the current team
        const teamMembersResponse = await axios.get(
          `http://127.0.0.1:3000/studentTeams/${team_id}`
        );

        const teamMembers = teamMembersResponse.data;

        const mappedMembers = teamMembers.map((member: any) => ({
          email: member.owner_email,
          role: getRoleText(member.your_role),
          profile_id: member.profile_id,
        }));

        setMembers(mappedMembers);
      } catch (error) {
        console.error("Error fetching team members:", error);
        setError("Failed to fetch team members");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [profile, team_id]);

  const getRoleText = (role: string) => {
    switch (role) {
      case "O":
        return "Owner";
      case "A":
        return "Admin";
      case "T":
        return "Team Lead";
      default:
        return "Unknown";
    }
  };

  const handleRemove = (profileId: number) => {
    // Implement remove functionality
    console.log(`Removing member with profile ID: ${profileId}`);
  };

  const handleOpenInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {team_name ? `${team_name} Members` : "Team Members"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenInviteModal}
        >
          INVITE MEMBER
        </Button>
      </Box>
      <TeamMembersTable members={members} onRemove={handleRemove} />
      <InviteMemberModal
        open={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        teamId={team_id}
      />
    </Box>
  );
};

export default ViewTeamMembersPage;
