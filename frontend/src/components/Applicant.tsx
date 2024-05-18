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
  
  // Endpoint to be used:
  //      GET /recruitmentRounds/{roundId}/openings-
  //        View all openings for a specific recruitment round
  // Sample response type:
  // {
  //     "total_pages": {},
  //     "current_page": {},
  //     "results": {
  //         [
  //             1: {
  //             "applications_received": {},
  //             "opening_status": {},
  //             "opening_name": {},
  //              },
  //             2: {
  //             "applications_received": {},
  //             "opening_status": {},
  //             "opening_name": {},
  //              },
  //         ]
  //     }
  // }
  

  export interface openingsResultProps {
    
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
  
  interface OpeningsTableProps {
    results: openingsResultProps[];
  }
  
  const generateRowFunction = (results: openingsResultProps[]) => {
    return results.map((result) => {
      return (
        <TableRow
          key={result.title}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {result.title}
          </TableCell>
          <TableCell>{result.application_count}</TableCell>
          <TableCell>
            {result.applications_pending_review} Applications Pending Review
          </TableCell>
          <TableCell>
            <Button variant="contained"> View </Button>
          </TableCell>
        </TableRow>
      );
    });
  };
  
  export function ApplicantOpeningsTable(props: OpeningsTableProps) {
    return (
      <>
        <TableContainer component={Paper}>
          <Table aria-label="openings_table">
            <TableHead>
              <TableCell> Opening Name </TableCell>
              <TableCell> Student Team </TableCell>
              <TableCell> Deadline </TableCell>
              <TableCell> Semester </TableCell>
            </TableHead>
            <TableBody>{generateRowFunction(props.results)}</TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
  