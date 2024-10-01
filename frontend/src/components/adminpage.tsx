import {
  TableContainer,
  TableHead,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { formatDeadline } from "../util/Util";

export interface adminOpeningResultProps {
  id: number;
  recruitment_round_id: number;
  recruitment_round_year: number;
  recruitment_round_semester: string;
  application_deadline: string;
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

interface adminOpeningTableProps {
  results: adminOpeningResultProps[];
}

const generateRowFunction = (results: adminOpeningResultProps[]) => {
  return results.map((result) => {
    return (
      <TableRow
        key={result.title}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {result.title}
        </TableCell>
        <TableCell>{formatDeadline(result.application_deadline)}</TableCell>
        <TableCell>{result.student_team_name}</TableCell>
        <TableCell>{result.recruitment_round_semester}</TableCell>
        <TableCell>{result.recruitment_round_year}</TableCell>
        <TableCell>
          <Button variant="contained"> Apply </Button>
        </TableCell>
      </TableRow>
    );
  });
};

export function AdminOpeningsTable(props: adminOpeningTableProps) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="openings_table">
          <TableHead>
            <TableCell> Opening Name </TableCell>
            <TableCell> Application Deadline </TableCell>
            <TableCell> Status </TableCell>
            <TableCell> Semester </TableCell>
            <TableCell> Opening </TableCell>
            <TableCell> </TableCell>
          </TableHead>
          <TableBody>{generateRowFunction(props.results)}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
