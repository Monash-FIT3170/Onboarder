import {
  TableContainer,
  TableHead,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../util/stores/authStore";

export interface StudentTeamResultProps {
  id: number; // user id
  student_team_id: number;
  student_team_name: string;
  user_team_role: string;
  student_team_owner: string;
}

export interface DashboardTableProps {
  results: StudentTeamResultProps[];
}

const generateRowFunction = (
  results: StudentTeamResultProps[],
  navigate: ReturnType<typeof useNavigate>
) => {
  const authStore = useAuthStore();

  const handleDeleteOrLeave = (u_role: string, u_id: number, t_id: number) => {
      if (u_role === "Owner") {
      } else {
      }
  };

  const handleView = (t_id: number, t_name: string, user_role: string) => {
      authStore.updateTeamAndRole(t_id, t_name, user_role);
      navigate("/viewrecruitmentround");
  };

  return results.map((result) => {
      return (
          <TableRow key={result.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                  {result.student_team_name}
              </TableCell>
              <TableCell>{result.user_team_role}</TableCell>
              <TableCell>{result.student_team_owner}</TableCell>{" "}
              {/* TODO add logic to say "You" if the user is the owner */}
              <TableCell>
                  <Button
                      variant="contained"
                      sx={{ padding: "6px 12px", marginRight: 2}}
                      onClick={() => {
                          handleDeleteOrLeave(
                              result.user_team_role,
                              result.id,
                              result.student_team_id
                          );
                      }}
                  >
                      {result.user_team_role === "Owner" ? "DELETE" : "LEAVE"}
                  </Button>
                  <Button
                      variant="contained"
                      style={{ 
                        padding: "6px 12px", 
                      }}
                      onClick={() => {
                          handleView(
                              result.student_team_id,
                              result.student_team_name,
                              result.user_team_role
                          );
                      }}
                  >
                      VIEW
                  </Button>
              </TableCell>
          </TableRow>
      );
  });
};

export function DashboardTable(props: DashboardTableProps) {
  const navigate = useNavigate();

  return (
      <>
          <TableContainer component={Paper}>
              <Table aria-label="openings_table">
                  <TableHead>
                      <TableCell> Team Name</TableCell>
                      <TableCell> Your Role</TableCell>
                      <TableCell> Owner </TableCell>
                      <TableCell> Actions </TableCell>
                  </TableHead>
                  <TableBody>{generateRowFunction(props.results, navigate)}</TableBody>
              </Table>
          </TableContainer>
      </>
  );
}
