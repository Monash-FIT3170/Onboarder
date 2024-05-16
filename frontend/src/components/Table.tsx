import {
  TableContainer,
  TableHead,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import React from 'react';
import styled from "styled-components";
import BackIcon from "../assets/BackIcon";

const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface TableEntryProps {
  id: number;
  deadline: string; // assuming deadline is a date in string format
  status: string;
  openings: number;
  applicationsReceived: number;
}

interface TableProps {
  entries: TableEntryProps[];
  onArchive: (id: number) => void;
}

const generateTableRows = (entries: TableEntryProps[]) => {
  return entries.map((entry, index) => (
    <TableRow key={index}>
      <TableCell>{entry.deadline}</TableCell>
      <TableCell>{entry.status}</TableCell>
      <TableCell align="center">{entry.openings}</TableCell>
      <TableCell align="center">{entry.applicationsReceived}</TableCell>
    </TableRow>
  ));
};

const CustomTable: React.FC<TableProps> = ({ entries }) => {
  return (
    <>
      <HeadWrapper>
        <BackIcon />
        <Typography variant="h6">Monash Nova Rover Recruitment 12</Typography>
        <Button
          variant="contained"
          style={{
            color: "black",
            backgroundColor: "white",
            borderColor: "black",
            borderWidth: "1px",
          }}
        >
          Archive Round and Send Results
        </Button>
      </HeadWrapper>
      <TableContainer component={Paper}>
        <Table aria-label="custom table">
          <TableHead>
            <TableRow>
              <TableCell>Deadline</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Openings</TableCell>
              <TableCell align="center">Applications Received</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{generateTableRows(entries)}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomTable;
