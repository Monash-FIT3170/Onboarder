import React, { useState } from "react";
import {
  TableContainer,
  TableHead,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Paper,
  Modal,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useOpeningStore } from "../util/stores/openingApplicantStore";

export interface onboarderOpeningResultProps {
  id: number;
  recruitment_round_id: number;
  recruitment_round_year: number;
  recruitment_round_semester: string;
  student_team_id: number;
  student_team_name: string;
  opening_title: string;
  description: string;
  status: string;
  required_skills: string[];
  desired_skills: string[];
  application_count: number;
  applications_pending_review: number;
  recruitment_round_deadline: string;
  recruitment_round_application_deadline: string;
  student_team_description: string;
  owner_email: string;
  opening_status: string;
}

interface onboarderOpeningTableProps {
  results: onboarderOpeningResultProps[];
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

export function OnboarderOpeningsTable(props: onboarderOpeningTableProps) {
  const navigate = useNavigate();
  const setOpeningDetails = useOpeningStore((state) => state.setOpeningDetails);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] =
    useState<onboarderOpeningResultProps | null>(null);
  const handleApply = (id: number, r_id: number) => {
    setOpeningDetails(r_id, id);
    navigate("/application-submission");
  };

  const handleTeamInfoClick = (team: onboarderOpeningResultProps) => {
    setSelectedTeam(team);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTeam(null);
  };

  const generateRowFunction = (
    results: onboarderOpeningResultProps[],
    // navigate: ReturnType<typeof useNavigate>,
    // setOpeningDetails: (round_id: number, opening_id: number) => void,
  ) => {
    return results.map((result) => {
      const formattedDeadline = (() => {
        const date = new Date(result.recruitment_round_deadline);
        const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0"); // Ensure 2 digits
        const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure 2 digits
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      })();

      return (
        <TableRow
          key={result.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {result.opening_title}
          </TableCell>
          <TableCell>{`${formattedDeadline}`}</TableCell>
          <TableCell>{`${result.student_team_name}`}</TableCell>
          <TableCell>{`Semester ${result.recruitment_round_semester}`}</TableCell>
          <TableCell>{`${result.recruitment_round_year}`}</TableCell>
          <TableCell>
            <Button
              variant="contained"
              style={{ marginRight: "10px", padding: 2 }}
              onClick={() => {
                handleApply(result.id, result.recruitment_round_id);
              }}
            >
              APPLY
            </Button>
            <Button
              variant="outlined"
              style={{ padding: 2 }}
              onClick={() => handleTeamInfoClick(result)}
            >
              View Team Info
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="openings_table">
          <TableHead>
            <TableRow>
              <TableCell> Opening Name </TableCell>
              <TableCell> Application Deadline </TableCell>
              <TableCell> Student Team </TableCell>
              <TableCell> Semester </TableCell>
              <TableCell> Year </TableCell>
              <TableCell> Actions </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {generateRowFunction(props.results, navigate, setOpeningDetails)}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="team-info-modal"
        aria-describedby="team-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="team-info-modal"
            variant="h5"
            component="h2"
            gutterBottom
          >
            Team Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {selectedTeam?.student_team_name}
          </Typography>
          <Typography variant="body1" paragraph>
            Team Description: <br></br>
            {selectedTeam?.student_team_description}
          </Typography>
          <Typography variant="body1" paragraph>
            Team Owner: <br></br>
            {selectedTeam?.owner_email}
          </Typography>
          <Button variant="contained" onClick={handleCloseModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}
