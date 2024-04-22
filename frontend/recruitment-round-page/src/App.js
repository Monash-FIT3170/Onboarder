import React from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import logo from './logo.svg';

const styles = {
  recruitmentRoundPage: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976d2',
    color: '#fff',
    padding: '1rem',
    textAlign: 'center',
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
    <Paper style={styles.recruitmentRoundPage}>
      <TableContainer style={styles.header}>
        <TableCell>
          <h2>Recruitment Rounds</h2>
        </TableCell>
      </TableContainer>
      <TableContainer style={styles.main}>
        <TableCell>
          <h3>Monash Nova</h3>
        </TableCell>
        <TableCell style={styles.section}>
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
              {/* Add active recruitment rounds rows */}
            </TableBody>
          </Table>
        </TableCell>
        <TableCell style={styles.section}>
          <h4>Archived Recruitment Rounds</h4>
          <TextField
            style={{ marginBottom: '1rem' }}
            variant="outlined"
            placeholder="Round Name, Deadline, etc..."
            size="small"
            fullWidth
          />
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
        </TableCell>
      </TableContainer>
    </Paper>
  );
};

function App() {
  return (
    <div className="App">
      <ViewRecruitmentRoundPage />
    </div>
  );
}

export default App;