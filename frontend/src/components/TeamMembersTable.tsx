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
  name: string;
  email: string;
  role: string;
}

interface TeamMembersTableProps {
  members: TeamMember[];
  onRemove: (index: number) => void;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  onRemove,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member, index) => (
            <TableRow key={index}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>
                {member.role === "Owner" ? (
                  "Current User"
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => onRemove(index)}
                  >
                    REMOVE
                  </Button>
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
