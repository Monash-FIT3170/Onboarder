import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Skeleton,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const AllocateTeamLeads = () => {
  const [openings, setOpenings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { teamLeadId } = useParams();

  useEffect(() => {
    const fetchOpenings = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/teamLeads/${teamLeadId}/openings`);
        setOpenings(response.data);
      } catch (error) {
        console.error("Error fetching openings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenings();
  }, [teamLeadId]);

  const handleAllocate = (openingId: number) => {
    // Logic to allocate or deallocate team lead to the opening
    console.log(`Allocating team lead ${teamLeadId} to opening ${openingId}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box display="flex" justifyContent="center" marginBottom="20px">
        <Typography variant="h4" textAlign="center">
          Allocate to Openings
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px">
        <Typography variant="h6">
          John Doe
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="openings table">
          <TableHead>
            <TableRow>
              <TableCell>Round Name</TableCell>
              <TableCell>Opening Name</TableCell>
              <TableCell>Team Leads Allocated</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={100} height={30} />
                    </TableCell>
                  </TableRow>
                ))
              : openings.map((opening) => (
                  <TableRow key={opening.id}>
                    <TableCell>{opening.roundName}</TableCell>
                    <TableCell>{opening.openingName}</TableCell>
                    <TableCell>{opening.teamLeadsAllocated}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleAllocate(opening.id)}
                      >
                        {opening.teamLeadsAllocated > 0 ? "De-allocate" : "Allocate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllocateTeamLeads;
