import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import PermissionButton from "./PermissionButton";

interface TeamMember {
  email: string;
  role: string;
  profile_id: number;
}

interface TeamMembersTableProps {
  members: TeamMember[];
  onRemove: (profileId: number) => void;
  currentUserProfileId: number;
  userRole: string;
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
                {userRole === "O" &&
                  member.profile_id !== currentUserProfileId && (
                    <PermissionButton
                      action="delete"
                      subject="Team"
                      onClick={() => onRemove(member.profile_id)}
                      tooltipText="You do not have permission to remove team members"
                      variant="outlined"
                      color="error"
                      size="small"
                    >
                      Remove
                    </PermissionButton>
                  )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamMembersTable;
