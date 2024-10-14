import {
  Box,
  Button,
  Modal,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleIcon from "../util/RoleIcon";
import { useAuthStore } from "../util/stores/authStore";
import { useStudentTeamStore } from "../util/stores/studentTeamStore";
import { getBaseAPIURL } from "../util/Util";

export interface StudentTeamResultProps {
  id: number; // user id
  student_team_id: number;
  student_team_name: string;
  user_team_role: string;
  student_team_owner: string;
  student_team_meeting_link: string;
}

export interface DashboardTableProps {
  newTeam: StudentTeamResultProps[];
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const generateRowFunction = (
  results: StudentTeamResultProps[],
  setModalData: (data: StudentTeamResultProps) => void,
  setDeleteModalOpen: (open: boolean) => void,
  setLeaveModalOpen: (open: boolean) => void,
  handleView: (
    team_id: number,
    team_meeting_link: string,
    team_name: string,
    user_role: string,
  ) => void,
) => {
  return (
    <>
      {results.map((result) => (
        <TableRow
          key={result.student_team_id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {result.student_team_name}
          </TableCell>
          <TableCell>
            <div style={{ display: "flex", alignItems: "center" }}>
              <RoleIcon role={result.user_team_role} />
              {result.user_team_role}
            </div>
          </TableCell>
          <TableCell>{result.student_team_owner}</TableCell>
          <TableCell>
            <Button
              variant="contained"
              sx={{ padding: "6px 12px", marginRight: 2 }}
              onClick={() => {
                setModalData(result);
                if (result.user_team_role === "Owner") {
                  setDeleteModalOpen(true);
                } else {
                  setLeaveModalOpen(true);
                }
              }}
            >
              {result.user_team_role === "Owner" ? "DELETE" : "LEAVE"}
            </Button>
            <Button
              variant="contained"
              style={{ padding: "6px 12px" }}
              onClick={() =>
                handleView(
                  result.student_team_id,
                  result.student_team_meeting_link,
                  result.student_team_name,
                  result.user_team_role,
                )
              }
            >
              View Details
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export function DashboardTable({ newTeam }: DashboardTableProps) {
  // State hooks

  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState<StudentTeamResultProps | null>(
    null,
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  //Constants

  const navigate = useNavigate();
  const BASE_API_URL = getBaseAPIURL();

  // Store hooks

  const authStore = useAuthStore();
  const { studentTeams, setStudentTeams } = useStudentTeamStore();

  // Effect hooks

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      let profileId = authStore.profile;

      if (!profileId) {
        profileId = await authStore.fetchProfile();
      }

      const response = await axios.get(
        `${BASE_API_URL}/profile/${profileId}/student-teams`, // Working
      );
      console.log("Response data: ", response.data);
      const tableData = response.data
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
          student_team_meeting_link: role.student_team_meeting_link,
        }))
        .sort((a: StudentTeamResultProps, b: StudentTeamResultProps) => {
          const roleRanking: { [key: string]: number } = {
            Owner: 0,
            Admin: 1,
            "Team Lead": 2,
          };
          return roleRanking[a.user_team_role] - roleRanking[b.user_team_role];
        });
      console.log("Table Data: ", tableData);
      setStudentTeams(tableData);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  }, [BASE_API_URL, newTeam]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);
  // Using fetchTeams in the dependency array won't cause an infinite loop
  // because it's wrapped in useCallback. The function reference only changes
  // if BASE_API_URL changes, preventing unnecessary re-renders.

  // Handler functions

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setLeaveModalOpen(false);
    setModalData(null);
  };

  const handleDeleteOrLeave = async (
    u_role: string,
    user_id: number,
    team_id: number,
  ) => {
    try {
      if (u_role === "Owner") {
        await axios.delete(`${BASE_API_URL}/student-team/${team_id}`);
      } else {
        await axios.delete(
          `${BASE_API_URL}/student-team/${team_id}/members/${user_id}`,
        );
      }
      fetchTeams();
    } catch (error) {
      console.error("Error deleting/leaving team:", error);
    } finally {
      handleCloseModal();
    }
  };

  const handleView = (
    team_id: number,
    team_meeting_link: string,
    team_name: string,
    user_role: string,
  ) => {
    authStore.updateTeamAndRole(
      team_id,
      team_meeting_link,
      team_name,
      user_role,
    );
    navigate("/view-recruitment-rounds");
  };

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (studentTeams.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">
          You are not a member of any teams yet.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/create-team")}
          sx={{ mt: 2 }}
        >
          Create a Team
        </Button>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="openings_table">
          <TableHead>
            <TableRow>
              <TableCell>Team Name</TableCell>
              <TableCell>Your Role</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {generateRowFunction(
              studentTeams,
              setModalData,
              setDeleteModalOpen,
              setLeaveModalOpen,
              handleView,
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={deleteModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          {modalData && (
            <>
              <Typography variant="h6" component="h2">
                Confirm Delete
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Are you sure you want to delete the team "
                {modalData.student_team_name}"?<br></br>
                You cannot undo this action.
              </Typography>
              <Button
                variant="contained"
                onClick={handleCloseModal}
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleDeleteOrLeave(
                    modalData.user_team_role,
                    authStore.user,
                    modalData.student_team_id,
                  );
                }}
                sx={{ mt: 2, ml: 2 }}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <Modal open={leaveModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          {modalData && (
            <>
              <Typography variant="h6" component="h2">
                Confirm Leave
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Are you sure you want to leave the team "
                {modalData.student_team_name}"?
              </Typography>
              <Button
                variant="contained"
                onClick={handleCloseModal}
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleDeleteOrLeave(
                    modalData.user_team_role,
                    authStore.profile,
                    modalData.student_team_id,
                  );
                }}
                sx={{ mt: 2, ml: 2 }}
              >
                Leave
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
