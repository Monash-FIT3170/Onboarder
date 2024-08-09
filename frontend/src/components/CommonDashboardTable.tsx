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

export interface commonDashboardResultProps {
    id: number; // user id
    student_team_id: number;
    student_team_name: string;
    user_team_role: string;
    student_team_owner: string;
}

interface commonDashboardTableProps {
    results: commonDashboardResultProps[];
}

const generateRowFunction = (
    results: commonDashboardResultProps[],
    navigate: ReturnType<typeof useNavigate>
) => {
    // const handleDeleteOrLeave = (u_id: number, t_id: number) => {
    //   // TODO implement functionality for deleting/leaving team
    // };
    const handleView = (t_id: number, r_name: string) => {
        navigate("/viewrecruitmentround", {
            state: {
                student_team_id: t_id,
                user_team_role: r_name,
            },
        });
    };
    return results.map((result) => {
        return (
            <TableRow key={result.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                    {result.student_team_name}
                </TableCell>
                <TableCell>{result.user_team_role}</TableCell>
                <TableCell>{result.student_team_owner}</TableCell> {/* TODO add logic to say "You" if the user is the owner */}
                <TableCell>
                    <Button
                        variant="contained"
                        style={{ padding: 0 }}
                        onClick={() => {
                            // handleDeleteOrLeave(result.id, result.student_team_id);
                        }}
                    >
                        {result.user_team_role === "Owner" ? "DELETE" : "LEAVE"}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ padding: 0 }}
                        onClick={() => {
                            handleView(result.student_team_id, result.user_team_role);
                        }}
                    >
                        VIEW ROUNDS
                    </Button>
                </TableCell>
            </TableRow>
        );
    });
};

export function CommonDashboardTable(props: commonDashboardTableProps) {
    const navigate = useNavigate();

    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="openings_table">
                    <TableHead>
                        <TableCell> Team Name</TableCell>
                        <TableCell> Your Role</TableCell>
                        <TableCell> Owner </TableCell>
                        <TableCell> Actions </TableCell>
                    </TableHead>
                    <TableBody>{generateRowFunction(props.results, navigate)}</TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
