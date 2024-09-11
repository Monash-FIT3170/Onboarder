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

export interface applicantOpeningResultProps {
  id: number;
  recruitment_round_id: number;
  recruitment_round_year: number;
  recruitment_round_semester: string;
  student_team_id: number;
  student_team_name: string;
  title: string;
  description: string;
  status: string;
  required_skills: string[];
  desired_skills: string[];
  application_count: number;
  applications_pending_review: number;
  deadline: string;
}

interface applicantOpeningTableProps {
  results: applicantOpeningResultProps[];
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function ApplicantOpeningsTable(props: applicantOpeningTableProps) {
  const navigate = useNavigate();
  const setOpeningDetails = useOpeningStore((state) => state.setOpeningDetails);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] =
    useState<applicantOpeningResultProps | null>(null);

  const handleApply = (id: number, r_id: number) => {
    setOpeningDetails(r_id, id);
    navigate("/application-submission");
  };

  const handleTeamInfoClick = (team: applicantOpeningResultProps) => {
    setSelectedTeam(team);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTeam(null);
  };

  const generateRowFunction = (
    results: applicantOpeningResultProps[],
    navigate: ReturnType<typeof useNavigate>,
    setOpeningDetails: (round_id: number, opening_id: number) => void
  ) => {
    return results.map((result) => {
      return (
        <TableRow
          key={result.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {result.title}
          </TableCell>
          <TableCell>{`${result.deadline}`}</TableCell>
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
              <TableCell> Deadline </TableCell>
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
            variant="h4"
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
            Team Description: {selectedTeam?.description}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Opening: {selectedTeam?.title}
          </Typography>
          <Button variant="contained" onClick={handleCloseModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}