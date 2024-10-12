import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import TeamMembersTable, { TeamMember } from "../components/TeamMembersTable";
import InviteMemberModal from "../components/InviteMemberModal";
import axios from "axios";
import { useAuthStore } from "../util/stores/authStore";
import { getBaseAPIURL } from "../util/Util";
import PermissionButton from "../components/PermissionButton";

const ViewTeamMembersPage: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    team_id: studentTeamId,
    team_name,
    ability,
    profile: currentUserProfileId,
    role: userRole,
  } = useAuthStore();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!studentTeamId) {
        setError("No team selected. Please choose a team first.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const BASE_API_URL = getBaseAPIURL();
        // First API call to get member info
        const profileTeamResponse = await axios.get(
          `${BASE_API_URL}/student-team/${studentTeamId}/members`,
        );
        const profileTeamInfo = profileTeamResponse.data;

        if (!Array.isArray(profileTeamInfo) || profileTeamInfo.length === 0) {
          throw new Error("No team members found");
        }

        // Fetch student information for each member
        const membersPromises = profileTeamInfo.map(async (memberInfo: any) => {
          try {
            const studentResponse = await axios.get(
              `${BASE_API_URL}/profile/${memberInfo.profile_id}`,
            );
            const studentInfo = studentResponse.data[0];

            if (!studentInfo) {
              throw new Error(
                `Student info not found for profile ${memberInfo.profile_id}`,
              );
            }

            return {
              email: studentInfo.email,
              role: getRoleText(memberInfo.role),
              profile_id: memberInfo.profile_id,
            };
          } catch (error) {
            console.error(
              `Error fetching student info for profile ${memberInfo.profile_id}:`,
              error,
            );
            return null;
          }
        });

        const resolvedMembers = await Promise.all(membersPromises);
        setMembers(
          resolvedMembers.filter(
            (member): member is TeamMember => member !== null,
          ),
        );
      } catch (error) {
        console.error("Error fetching team members:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch team members",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [studentTeamId, isInviteModalOpen]);

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

  const handleRemove = async (profileId: number) => {
    if (!studentTeamId) return;

    try {
      const BASE_API_URL = getBaseAPIURL();
      await axios.delete(
        `${BASE_API_URL}/student-team/${studentTeamId}/members/${profileId}`,
      );

      // Remove the member from the local state
      setMembers(members.filter((member) => member.profile_id !== profileId));

      setSnackbar({
        open: true,
        message: "Team member removed successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error removing team member:", error);
      setSnackbar({
        open: true,
        message: "Failed to remove team member",
        severity: "error",
      });
    }
  };

  const handleOpenInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate("/dashboard")} sx={{ mt: 2 }}>
          Go to Dashboard
        </Button>
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

        <PermissionButton
          action="invite"
          subject="Team"
          variant="contained"
          color="primary"
          onClick={handleOpenInviteModal}
          tooltipText="You do not have permission to invite team members"
        >
          ADD MEMBER
        </PermissionButton>
      </Box>
      {members.length > 0 ? (
        <TeamMembersTable
          members={members}
          onRemove={handleRemove}
          currentUserProfileId={currentUserProfileId}
          userRole={userRole}
        />
      ) : (
        <Alert severity="info">
          No team members found. Add members to get started!
        </Alert>
      )}
      <InviteMemberModal
        open={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        teamId={studentTeamId}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewTeamMembersPage;
