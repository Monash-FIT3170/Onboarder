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
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

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
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <h3>Recruitment Rounds</h3>
          </Grid>
        </Grid>
        <section style={styles.section}>
          <h4>Active Recruitment Rounds</h4>
          <TextField
            style={{ marginBottom: '1rem' }}
            variant="outlined"
            placeholder="Round Name, Deadline, etc..."
            size="small"
            fullWidth
          />
          <Button variant="contained" style={styles.addRoundButton}>
            ADD ROUND
          </Button>
          <TableContainer component={Paper}>
            <Table style={styles.table}>
              <TableHead style={styles.tableHeader}>
                <TableRow>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Status</TableCell>
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