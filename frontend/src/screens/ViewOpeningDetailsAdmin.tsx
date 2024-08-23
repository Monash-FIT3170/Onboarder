import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Button
} from '@mui/material';
import BackIcon from '../assets/BackIcon';

const PaddingBox = styled.div`
  margin-bottom: 40px;
`;
const PaddingBox2 = styled.div`
  margin-bottom: 20px;
`;



// Mock data for demonstration purposes
const data = [
  { name: 'John Doe', email: 'john.doe@example.com', status: 'Submitted', date: '2024-08-20' },
  { name: 'Jane Smith', email: 'jane.smith@example.com', status: 'Pending', date: '2024-08-21' },
  { name: 'Sam Brown', email: 'sam.brown@example.com', status: 'Approved', date: '2024-08-22' },
];

const ViewOpeningDetailsAdmin =() => {

  const [searchTerm, setSearchTerm] = useState(""); 

  // Filter by search
  const filteredData = data.filter((applicant) =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateTableRows = () => {
    return filteredData.map((applicant, index) => (
      <TableRow key={index}>
        <TableCell>{applicant.name}</TableCell>
        <TableCell>{applicant.email}</TableCell>
        <TableCell>{applicant.status}</TableCell>
        <TableCell>{applicant.date}</TableCell>
        <TableCell>
        <Button variant="outlined">Interview Notes</Button>
        </TableCell>
        <TableCell>
          <Button variant="contained">View</Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      
      <PaddingBox2></PaddingBox2>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <BackIcon />
          <Typography variant="h6" sx={{ ml: 2 }}>Operating: Events Officer</Typography>
        </Box>
        <Box>
          <Button variant="outlined">CONFIGURE EMAIL</Button>
          <Button variant="contained" sx={{ ml: 2 }}>VIEW CANDIDATE SUBMISSION STATUS</Button>
        </Box>
      </Box>

      <PaddingBox>
      
      <PaddingBox></PaddingBox>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
            <TableRow>
                <TableCell>Recuritment Round</TableCell>
                <TableCell>Applications Received for Opening</TableCell>
            </TableRow>

            <TableRow>
                <TableCell>Monash Nova</TableCell>
                <TableCell>2</TableCell>
            </TableRow>
          </TableHead>
          </Table>
      </TableContainer>


      <PaddingBox></PaddingBox>
      <Typography variant='h6'>Opening Applications</Typography>
      <PaddingBox2></PaddingBox2>

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <TextField
            id="outlined-search"
            label="Search Applicants"
            type="search"
            value={searchTerm} // Bind input value to state
            onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
          />
        </Box>
        <Box>
          <Button variant="contained" sx={{ ml: 2 }}>SEND AVAILABILITY EMAILS</Button>
        </Box>
      </Box>

    
      <PaddingBox2></PaddingBox2>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Student Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date of Submsission</TableCell>
                <TableCell>1</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{generateTableRows()}</TableBody>
          </Table>
        </TableContainer>
      </PaddingBox>
    </>
  );
};

export default ViewOpeningDetailsAdmin;
