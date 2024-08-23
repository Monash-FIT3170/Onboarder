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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewTeamLeads = () => {
  const [teamLeads, setTeamLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamLeads = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/teamLeads");
        setTeamLeads(response.data);
      } catch (error) {
        console.error("Error fetching team leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamLeads();
  }, []);

  const handleViewAllocations = (teamLeadId: number) => {
    navigate(`/allocateTeamLeads/${teamLeadId}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Typography variant="h4" style={{ textAlign: "center" }}>
          Team Leads
        </Typography>
      </div>
      <TableContainer component={Paper} elevation={0}>
        <Table aria-label="team leads table">
          <TableHead>
            <TableRow>
              <TableCell>List of Team Leads</TableCell>
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
                      <Skeleton variant="rectangular" width={100} height={30} />
                    </TableCell>
                  </TableRow>
                ))
              : teamLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleViewAllocations(lead.id)}
                      >
                        View Allocations
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

export default ViewTeamLeads;
