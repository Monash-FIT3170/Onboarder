import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Typography from '@mui/material/Typography';

const styles = {
  recruitmentRoundPage: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976d2',
    color: '#fff',
    padding: '1rem',
    textAlign: 'left',
  },
  main: {
    padding: '2rem',
  },
  monashNova: {
    color: 'gray',
    marginBottom: '1rem',
  },
  section: {
    marginBottom: '2rem',
  },
  addRoundButton: {
    marginBottom: '1rem',
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
  },
  viewButton: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

const ViewRecruitmentRoundPage = () => {
  return (
    <div style={styles.recruitmentRoundPage}>
      <header style={styles.header}>
        <h2>Onboarding: Recruitment Platform</h2>
      </header>
      <main style={styles.main}>
        <Typography variant="h4" style={styles.monashNova}>
          Monash Nova
        </Typography>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <h3>Recruitment Rounds</h3>
          </Grid>
        </Grid>
        <section style={styles.section}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <h4>Active Recruitment Rounds</h4>
            </Grid>
            <Grid item>
              <Button variant="contained" style={styles.addRoundButton}>
                ADD ROUND
              </Button>
            </Grid>
          </Grid>
          <TextField
            style={{ marginBottom: '1rem' }}
            variant="outlined"
            placeholder="Round Name, Deadline, etc..."
            size="small"
            fullWidth
          />
          <TableContainer component={Paper}>
            <Table style={styles.table}>
              <TableHead style={styles.tableHeader}>
                <TableRow>
                  <TableCell>Round Name</TableCell>
                  <TableCell>
                    <Grid container alignItems="center">
                      <Grid item>Deadline</Grid>
                      <Grid item>
                        <ArrowDownwardIcon fontSize="small" />
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Openings</TableCell>
                  <TableCell>Applications Received</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Add active recruitment rounds rows */}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
        <section style={styles.section}>
          <h4>Archived Recruitment Rounds</h4>
          <TableContainer component={Paper}>
            <Table style={styles.table}>
              <TableHead style={styles.tableHeader}>
                <TableRow>
                  <TableCell>Round Name</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Openings</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Add archived recruitment rounds rows */}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
      </main>
    </div>
  );
};

export default ViewRecruitmentRoundPage;