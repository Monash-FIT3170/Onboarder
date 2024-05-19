import {
  TableContainer,
  TableHead,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material";
import React from "react";
import { formatDeadline, getStatusText } from "../util/Util";

export interface SingleRoundResultProps {
  id: number;
  deadline: string; // assuming deadline is a date in string format
  semester: number;
  year: number;
  student_team_id: number;
  student_team_name: string;
  status: string;
  openings_count: number;
}

interface SingleRoundTableProps {
  results: SingleRoundResultProps[];
}

const generateTableRows = (results: SingleRoundResultProps[]) => {
  return results.map((result) => (
    <TableRow key={result.id}>
      <TableCell>{formatDeadline(result.deadline)}</TableCell>
      <TableCell>{getStatusText(result.status)}</TableCell>
      <TableCell align="center">{result.openings_count}</TableCell>
      {/* <TableCell align="center">{entry.applicationsReceived}</TableCell> */}
      <TableCell align="center">10</TableCell>
    </TableRow>
  ));
};

export const SingleRoundTable: React.FC<SingleRoundTableProps> = (
  props: SingleRoundTableProps
) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="custom table">
          <TableHead>
            <TableRow>
              <TableCell>Deadline</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Openings</TableCell>
              <TableCell align="center">Applications Received</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{generateTableRows(props.results)}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
