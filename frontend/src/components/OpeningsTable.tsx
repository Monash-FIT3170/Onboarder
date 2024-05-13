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

const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  position: relative;
  top: 10px;
`;

const ButtonWrapper = styled.div`
  position: relative;
  left: -20px;
`;

interface openingsResultProps {
  opening_name: string;
  applications_received: number;
  opening_status: string;
}

export interface OpeningsTableProps {
  results: openingsResultProps[];
}

const generateRowFunction = (results: openingsResultProps[]) => {
  return results.map((result) => {
    return (
      <TableRow
        key={result.opening_name}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {result.opening_name}
        </TableCell>
        <TableCell>{result.applications_received}</TableCell>
        <TableCell>{result.opening_status}</TableCell>
        <TableCell>
          <Button variant="contained"> View </Button>
        </TableCell>
      </TableRow>
    );
  });
};

export function OpeningsTable(props: OpeningsTableProps) {
  return (
    <>
      <HeadWrapper>
        <Typography variant="h5">Recruitment Round Openings</Typography>
        <ButtonWrapper>
          <Button variant="contained"> Add Opening </Button>
        </ButtonWrapper>
      </HeadWrapper>
      <TableContainer component={Paper}>
        <Table aria-label="openings_table">
          <TableHead>
            <TableCell> Opening Name </TableCell>
            <TableCell> Applications Received </TableCell>
            <TableCell> Status of Applications </TableCell>
          </TableHead>
          <TableBody>{generateRowFunction(props.results)}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
