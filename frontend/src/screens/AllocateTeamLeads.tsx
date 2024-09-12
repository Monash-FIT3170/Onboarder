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
    IconButton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMemberStore } from "../util/stores/memberStore";
import { useAuthStore } from "../util/stores/authStore";

const AllocateTeamLeads = () => {
    const [openings, setOpenings] = useState<any[]>([]);
    const [counts, setCounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { teamLeadId } = useParams();
    const navigate = useNavigate();
    const setSelectedMember = useMemberStore((state) => state.setSelectedMember);
    const selectedMember = useMemberStore((state) => state.selectedMember);
    const { team_id, team_name } = useAuthStore();

    const handleAllocate = async (openingId: number) => {
        const teamLeadId = selectedMember?.id;
        if (!teamLeadId || !openingId) {
            alert("Please fill in all fields " + teamLeadId + " " + openingId);
            return;
        }
        
        setLoading(true);
        try {
            const API_URL = `http://127.0.0.1:3000/opening/${openingId}/team-lead-assign`;
            await axios.post(API_URL, {
                profile_id: teamLeadId
            });
            console.log("Team lead allocated successfully");
            // Refresh the openings list after allocation
            fetchTeamOpenings();
        } catch (error) {
            console.error("Error allocating team lead:", error);
        } finally {
            fetchTeamOpenings();
            setLoading(false);
        }
    };

    const fetchTeamOpenings = async () => {
        if (!team_id) {
            console.error("No team selected");
            setLoading(false);
            return;
        }

        try {
            const profileTeamResponse = await axios.get(
                `http://127.0.0.1:3000/student-team/${team_id}/recruitment-round`
            );
            const roundInfo = profileTeamResponse.data;

            if (roundInfo.length === 0) {
                throw new Error("Profile team information not found");
            }

            const openingPromises = roundInfo.map(async (oneRoundInfo: any) => {
                try {
                    const openingsResponse = await axios.get(
                        `http://127.0.0.1:3000/recruitment-round/${oneRoundInfo.id}/opening`
                    );

                    return openingsResponse.data.map((opening: any) => ({
                        ...opening,
                        round_name: oneRoundInfo.round_name,
                    }));
                } catch (error) {
                    console.error(`Error fetching openings for round ${oneRoundInfo.id}:`, error);
                    return [];
                }
            });
            
            const resolvedOpenings = await Promise.all(openingPromises);

            console.log("Resolved Openings: " + resolvedOpenings.flat());
            setOpenings(resolvedOpenings.flat());

            const countPromises = resolvedOpenings.map(async (oneOpeningInfo: any) => {
                try {
                    const leadCountResponse = await axios.get(
                        `http://127.0.0.1:3000/opening/${oneOpeningInfo.id}/team-lead-assign`
                    );
                    
                    return leadCountResponse.data.map((count: any) => ({
                        ...count,
                        // round_name: oneOpeningInfo.round_name,
                    }));
                } catch (error) {
                    console.error(`Error fetching openings for round ${oneOpeningInfo.id}:`, error);
                    return [];
                }
            });

            const resolvedCounts = await Promise.all(countPromises);
            
            console.log("Resolved Counts: " + resolvedCounts.flat());
            setCounts(resolvedCounts.flat());
        } catch (error) {
            console.error("Error fetching team openings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamOpenings();
    }, [team_id]);

    return (
        <div style={{ padding: "20px" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" textAlign="center">
                    Allocate to Openings
                </Typography>
            </Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom="10px"
            >
                <Typography variant="h6">{selectedMember?.email}</Typography>
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
                                      <TableCell>{opening.student_team_name + " " + opening.recruitment_round_id}</TableCell>
                                      <TableCell>{opening.opening_title}</TableCell>
                                      <TableCell>{opening.team_leads_allocated || 0}</TableCell>
                                      <TableCell>
                                          <Button
                                              variant="contained"
                                              onClick={() => handleAllocate(opening.id)}
                                          >
                                              {opening.team_leads_allocated > 0
                                                  ? "De-allocate"
                                                  : "Allocate"}
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