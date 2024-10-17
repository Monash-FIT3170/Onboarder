import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export interface openingsResultProps {
  id: number;
  recruitment_round_id: number;
  recruitment_round_year: number;
  recruitment_round_semester: string;
  application_deadline: string;
  interview_preference_deadline: string;
  interview_period: string;
  student_team_id: number;
  student_team_name: string;
  title: string;
  description: string;
  status: string;
  required_skills: string[];
  desired_skills: string[];
  applications_count: number;
  applications_pending_review: number;
  opening_title: string;
  interview_allocation_status: string;
  calendar_invites_sent: boolean;
}

interface RecruitmentRoundOpeningsTableProps {
  results: openingsResultProps[];
  viewHandler: (
    id: number,
    recruitment_round_id: number,
    student_team_name: string,
    title: string,
    applications_count: number,
    interview_allocation_status: string,
    calendar_invites_sent: boolean,
  ) => void;
}

const generateRowFunction = (
  results: openingsResultProps[],
  viewHandler: (
    id: number,
    recruitment_round_id: number,
    student_team_name: string,
    title: string,
    applications_count: number,
    interview_allocation_status: string,
    calendar_invites_sent: boolean,
  ) => void,
) => {
  return results
    .sort((a, b) => a.id - b.id)
    .map((result) => {
      return (
        <TableRow
          key={result.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {result.opening_title}
          </TableCell>
          <TableCell>{result.applications_count}</TableCell>
          {/* <TableCell>
            {result.applications_pending_review} Applications Pending Review
          </TableCell> */}
          <TableCell>
            <Button
              variant="contained"
              onClick={() =>
                viewHandler(
                  result.id,
                  result.recruitment_round_id,
                  result.student_team_name,
                  result.opening_title,
                  result.applications_count,
                  result.interview_allocation_status,
                  result.calendar_invites_sent,
                )
              }
            >
              View Opening
            </Button>
          </TableCell>
        </TableRow>
      );
    });
};

export function RecruitmentRoundOpeningsTable(
  props: RecruitmentRoundOpeningsTableProps,
) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="openings_table">
          <TableHead>
            <TableCell> Opening Name </TableCell>
            <TableCell> Applications Received </TableCell>
            <TableCell></TableCell>
            {/* <TableCell> Status of Applications </TableCell> */}
          </TableHead>
          <TableBody>
            {generateRowFunction(props.results, props.viewHandler)}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
