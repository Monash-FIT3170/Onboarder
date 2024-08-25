import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

export interface TeamMember {
  email: string;
  role: string;
  profile_id: number;
}

interface TeamMembersTableProps {
  members: TeamMember[];
  onRemove: (profileId: number) => void;
  currentUserProfileId: number | null;
  userRole: string | null;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  onRemove,
  currentUserProfileId,
  userRole,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.profile_id}>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>
                {member.profile_id === currentUserProfileId ? (
                  "Current User"
                ) : userRole === "O" && member.role !== "Owner" ? (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => onRemove(member.profile_id)}
                  >
                    REMOVE
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamMembersTable;
