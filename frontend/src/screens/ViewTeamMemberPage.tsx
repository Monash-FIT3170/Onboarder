import React, { useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import TeamMembersTable, { TeamMember } from "../components/TeamMembersTable";
import InviteMemberModal from "./InviteMemberModal";

const TeamMembersPage: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([
    { name: "John Doe", email: "jdoe001@student.monash.edu", role: "Owner" },
    { name: "John Doe", email: "jdoe001@student.monash.edu", role: "Admin" },
    { name: "John Doe", email: "jdoe001@student.monash.edu", role: "Admin" },
    {
      name: "John Doe",
      email: "jdoe001@student.monash.edu",
      role: "Team Lead",
    },
    {
      name: "John Doe",
      email: "jdoe001@student.monash.edu",
      role: "Team Lead",
    },
    {
      name: "John Doe",
      email: "jdoe001@student.monash.edu",
      role: "Team Lead",
    },
  ]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleRemove = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleOpenInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Team Members
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
      />
    </Box>
  );
};

export default TeamMembersPage;
