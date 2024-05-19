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
} from "@mui/material"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { formatDeadline } from "../util/Util"


export interface applicantOpeningResultProps {
  id: number
  recruitment_round_id: number
  recruitment_round_year: number
  recruitment_round_semester: string
  deadline: string
  student_team_id: number
  student_team_name: string
  title: string
  description: string
  status: string
  required_skills: string[]
  desired_skills: string[]
  application_count: number
  applications_pending_review: number
}

interface applicantOpeningTableProps {
  results: applicantOpeningResultProps[]
}




const generateRowFunction = (results: applicantOpeningResultProps[]) => {
  const navigate = useNavigate();
  const handleApply = (id: number) => {
    navigate("/application-submission", {
      state: {
        id: id,
      },
    })
  }
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
              handleApply(result.id)
            }}
          >
            APPLY
          </Button>
        </TableCell>
      </TableRow>
    )
  })
}

export function ApplicantOpeningsTable(props: applicantOpeningTableProps) {
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
          <TableBody>{generateRowFunction(props.results)}</TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
