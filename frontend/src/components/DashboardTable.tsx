import {
  TableHead,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export interface StudentTeamResultProps {
  team_name: string;
  role: string;
  owner_info: string;
}

export interface DashboardTableProps {
  results: StudentTeamResultProps[];
}

const ActionCell = styled(TableCell)({
  display: "flex",
  gap: "4px",
  justifyContent: "flex-end",
});

const HeaderCell = styled(TableCell)({
  fontWeight: "bold",
});

const TableWidth = styled(Table)({
  width: "85%",
});

const generateRowFunction = (results: StudentTeamResultProps[]) => {
  return results.map((result) => {
    return (
      <TableRow key={result.team_name}>
        <TableCell component="th" scope="row">
          {result.team_name}
        </TableCell>
        <TableCell>{result.role}</TableCell>
        <TableCell>{result.owner_info}</TableCell>
        <ActionCell>
          <Button
            variant="contained"
            onClick={() => {
              console.log("Leave team clicked");
            }}
          >
            Leave Team
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              console.log("View rounds clicked");
            }}
          >
            View Rounds
          </Button>
        </ActionCell>
      </TableRow>
    );
  });
};

export function DashboardTable(props: DashboardTableProps) {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <TableWidth aria-label="dashboard_table">
        <TableHead>
          <TableRow>
            <HeaderCell>Team Name</HeaderCell>
            <HeaderCell>Your Role</HeaderCell>
            <HeaderCell>Owner</HeaderCell>
            <HeaderCell></HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{generateRowFunction(props.results)}</TableBody>
      </TableWidth>
    </Box>
  );
}
