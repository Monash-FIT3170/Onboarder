import React, { useState } from 'react';
import styled from "styled-components";
import {
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton
} from "@mui/material";
import BackIcon from '../assets/BackIcon';
import { useNavigate } from "react-router-dom";


const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 10vh;
  align-items: center;
  gap: 50px;
`;

const PaddingBox = styled.div`
  margin-bottom: 30px;
`;

// Mock data
const mockData = [
  {
    applicantName: "John Doe",
    email: "john.doe@example.com",
    roundName: "Round 1",
    studentTeam: "Monash Deep Neuron",
    interviewSlots: "10:00 AM - 10:30 AM",
    slotSelected: "YES",
  },
  {
    applicantName: "Jane Smith",
    email: "jane.smith@example.com",
    roundName: "Round 2",
    studentTeam: "Monash Nova",
    interviewSlots: "11:00 AM - 11:30 AM",
    slotSelected: "NO",
  },
  {
    applicantName: "Alice Johnson",
    email: "alice.johnson@example.com",
    roundName: "Round 1",
    studentTeam: "Monash Human Power",
    interviewSlots: "01:00 PM - 01:30 PM",
    slotSelected: "YES",
  },

];

const ViewInterviewAllocation = () => {
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate();
  // Filter by search
  const filteredData = mockData.filter((applicant) =>
    applicant.applicantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateTableRows = () => {
    return filteredData.map((applicant, index) => (
      <TableRow key={index}>
        <TableCell>{applicant.applicantName}</TableCell>
        <TableCell>{applicant.email}</TableCell>
        <TableCell>{applicant.roundName}</TableCell>
        <TableCell>{applicant.studentTeam}</TableCell>
        <TableCell>{applicant.interviewSlots}</TableCell>
        <TableCell>{applicant.slotSelected}</TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <TitleWrapper>
        <Typography variant="h4">Candiate Submission Status</Typography>
      </TitleWrapper>
      <PaddingBox></PaddingBox>
      <Box display="flex" alignItems="center">
      <IconButton
           onClick={() =>  navigate("/viewopen") }
        >
          <BackIcon />
        </IconButton>
      
      <Typography variant="h6" sx={{ ml: 2 }}>Operating: Events Officer</Typography>
      </Box>
      <PaddingBox>
      <PaddingBox></PaddingBox>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableRow>
              <TableCell>Recruitment Round</TableCell>
              <TableCell>Due Date</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Monash Nova Rover Recruitment 1</TableCell>
              <TableCell>Cell</TableCell>
            </TableRow>
        </Table>
      </TableContainer>
        <PaddingBox></PaddingBox>
        <TextField
          id="outlined-search"
          label="Search Applicants"
          type="search"
          value={searchTerm} // Bind input value to state
          onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
        />
      </PaddingBox>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Round Name</TableCell>
              <TableCell>Student Team</TableCell>
              <TableCell>Interview Slots</TableCell>
              <TableCell>Slot selected</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{generateTableRows()}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ViewInterviewAllocation;
