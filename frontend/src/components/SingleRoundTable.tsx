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
  application_deadline: string; // assuming application_deadline is a date in string format
  interview_preference_deadline: string; // assuming interview_preference_deadline is a date in string format
  interview_period: string[]; // assuming interview_period is a date in string format
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
      <TableCell>{formatDeadline(result.application_deadline)}</TableCell>
      <TableCell>
        {formatDeadline(result.interview_preference_deadline)}
      </TableCell>
      <TableCell>
        {result.interview_period.length > 1
          ? `${formatDeadline(result.interview_period[0])} - ${formatDeadline(result.interview_period[result.interview_period.length - 1])}`
          : formatDeadline(result.interview_period[0])}
      </TableCell>
      <TableCell>{result.semester}</TableCell>
      <TableCell>{getStatusText(result.status)}</TableCell>
      <TableCell align="center">{result.openings_count}</TableCell>
    </TableRow>
  ));
};

export const SingleRoundTable: React.FC<SingleRoundTableProps> = (
  props: SingleRoundTableProps,
) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="custom table">
          <TableHead>
            <TableRow>
              <TableCell>Application Deadline</TableCell>
              <TableCell>Interview Preference Deadline</TableCell>
              <TableCell>Interview Period</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Openings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{generateTableRows(props.results)}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
