import {
  TableContainer,
  TableHead,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Paper,
  Box,
  Modal,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../util/stores/authStore";
import axios from "axios";
import { useState } from "react";
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
  results: StudentTeamResultProps[];
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
  navigate: ReturnType<typeof useNavigate>,
) => {
  const authStore = useAuthStore();
  const [modalData, setModalData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const BASE_API_URL = getBaseAPIURL();

  const handleView = (
    t_id: number,
    t_link: string,
    t_name: string,
    user_role: string,
  ) => {
    authStore.updateTeamAndRole(t_id, t_link, t_name, user_role);
    navigate("/viewrecruitmentround");
  };

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
    if (u_role === "Owner") {
      // Delete Team
      try {
        const API_URL = `${BASE_API_URL}/student-team/${team_id}`;
        await axios.delete(API_URL);
      } catch (error) {
        console.error("Error deleting team:", error);
      } finally {
        // setLoading(false);
      }
    } else {
      // Leave Team
      try {
        // console.log(user_id, team_id);
        const API_URL = `${BASE_API_URL}/student-team/${team_id}/members/${user_id}`;
        await axios.delete(API_URL);
      } catch (error) {
        console.error("Error removing user from team:", error);
      } finally {
        // setLoading(false);
        navigate("/dashboard");
      }
    }
  };

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
          <TableCell>{result.user_team_role}</TableCell>
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
                  // Add your delete logic here
                  // console.log(modalData);
                  handleDeleteOrLeave(
                    modalData.user_team_role,
                    authStore.user,
                    modalData.student_team_id,
                  );
                  handleCloseModal();
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
                  // Add your leave logic here
                  // console.log(modalData);
                  handleDeleteOrLeave(
                    modalData.user_team_role,
                    authStore.profile,
                    modalData.student_team_id,
                  );
                  handleCloseModal();
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
};

export function DashboardTable(props: DashboardTableProps) {
  const navigate = useNavigate();

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="openings_table">
          <TableHead>
            <TableRow>
              <TableCell> Team Name</TableCell>
              <TableCell> Your Role</TableCell>
              <TableCell> Owner </TableCell>
              <TableCell> Actions </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{generateRowFunction(props.results, navigate)}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
