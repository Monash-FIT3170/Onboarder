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
import { formatDeadline } from "../util/Util";

export interface applicantOpeningResultProps {
  id: number;
  recruitment_round_id: number;
  recruitment_round_year: number;
  recruitment_round_semester: string;
  deadline: string;
  student_team_id: number;
  student_team_name: string;
  title: string;
  description: string;
  status: string;
  required_skills: string[];
  desired_skills: string[];
  application_count: number;
  applications_pending_review: number;
}

interface applicantOpeningTableProps {
  results: applicantOpeningResultProps[];
}

const generateRowFunction = (
  results: applicantOpeningResultProps[],
  navigate: ReturnType<typeof useNavigate>
) => {
  const handleApply = (id: number, r_id: number) => {
    navigate("/application-submission", {
      state: {
        round_id: r_id,
        opening_id: id,
      },
    });
  };
  return results.map((result) => {
    return (
      <TableRow
        key={result.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {result.title}
        </TableCell>
        <TableCell>{formatDeadline(result.deadline)}</TableCell>
        <TableCell>{result.student_team_name}</TableCell>
        <TableCell>{result.recruitment_round_semester}</TableCell>
        <TableCell>{result.recruitment_round_year}</TableCell>
        <TableCell>
          <Button
            variant="contained"
            style={{ padding: 0 }}
            onClick={() => {
              handleApply(result.id, result.recruitment_round_id);
            }}
          >
            APPLY
          </Button>
        </TableCell>
      </TableRow>
    );
  });
};

export function ApplicantOpeningsTable(props: applicantOpeningTableProps) {
  const navigate = useNavigate();

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="openings_table">
          <TableHead>
            <TableCell> Opening Name </TableCell>
            <TableCell> Deadline </TableCell>
            <TableCell> Student Team </TableCell>
            <TableCell> Semester </TableCell>
            <TableCell> Year </TableCell>
          </TableHead>
          <TableBody>{generateRowFunction(props.results, navigate)}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
