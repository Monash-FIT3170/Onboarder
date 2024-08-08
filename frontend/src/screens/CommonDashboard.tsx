import {
    Button,
    Grid,
    TableContainer,
    TableBody,
    TableHead,
    Table,
    TableRow,
    TableCell,
    Paper
} from "@mui/material";
const styles = {
    commonDashboard: {
        fontFamily: "Arial, sans-serif",
    },
    studentTeam: {
        color: "gray",
        marginBottom: "1rem",
    },
    section: {
        marginBottom: "2rem",
    },
    addRoundButton: {
        marginBottom: "1rem",
    },
    table: {
        minWidth: 650,
    },
    tableHeader: {
        backgroundColor: "#f2f2f2",
    },
    viewButton: {
        backgroundColor: "#1976d2",
        color: "white",
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    scrollableTableBody: {
        height: "calc(100vh - 400px)",
        overflowY: "auto",
        display: "block",
    },
};

function CommonDashboard() {
    return (
        <div style={styles.commonDashboard}>
            <main>
                <h1 style={{ textAlign: "center", fontSize: "4em", fontWeight: "100" }}>
                    Student Teams
                </h1>
                <section style={styles.section}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <h4>
                                Your Student Teams
                            </h4>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" style={styles.addRoundButton}>
                                ADD TEAM
                            </Button>
                        </Grid>
                    </Grid>
                    <TableContainer component={Paper} style={styles.scrollableTableBody}>
                        <Table style={styles.table} stickyHeader>
                            <TableHead style={styles.tableHeader}>
                                <TableRow>
                                    <TableCell>Team Name</TableCell>
                                    <TableCell>
                                        Your Role
                                    </TableCell>
                                    <TableCell>Owner</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </section>

                <section style={styles.section}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <h4>
                                Other Actions
                            </h4>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" style={{
                                backgroundColor: 'white',
                                color: 'black',
                                border: '1px solid black'
                            }}
                            >
                                VIEW INTERVIEWS AND CHANGE AVAILABILITY
                            </Button>
                        </Grid>
                    </Grid>
                </section>
            </main>
        </div>
    )
};

export default CommonDashboard;