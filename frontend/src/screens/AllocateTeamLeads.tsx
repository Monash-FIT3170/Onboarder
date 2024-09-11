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
    const [loading, setLoading] = useState(true);
    const { teamLeadId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const setSelectedMember = useMemberStore((state) => state.setSelectedMember);
    const selectedMember = useMemberStore((state) => state.selectedMember);
    const API_URL = "http://127.0.0.1:3000/student-team/{openingId}/team-lead-assign";

    const handleAllocate = (openingId: number) => {
        // Logic to allocate or deallocate team lead to the opening
        // navigate("/allocate-team-leads");

        if (!teamLeadId || !openingId) {
            alert("Please fill in all fields");
            return;
        }
        
        setLoading(true);
        try {
            axios.post(API_URL, {
                team_lead_id: teamLeadId,
                opening_id: openingId,
            });
            console.log("Team lead allocated successfully");
        } catch (error) {
            console.error("Error allocating team lead:", error);
        } finally {
            setLoading(false);
        
        console.log(`Allocating team lead ${teamLeadId} to opening ${openingId}`);
    };
    const { team_id, team_name } = useAuthStore();

    useEffect(() => {
        const fetchTeamOpenings = async () => {
            if (!team_id) {
                // setError("No team selected");
                // setIsLoading(false);
                return;
            }

            try {
                // First API call to get rounds
                const profileTeamResponse = await axios.get(
                    `http://127.0.0.1:3000/studentTeams/${team_id}/recruitmentRounds`
                );
                const roundInfo = profileTeamResponse.data;
                console.log(roundInfo);
                if (roundInfo.length === 0) {
                    throw new Error("Profile team information not found");
                }

                // Fetch student information for each member
                const openingPromises = roundInfo.map(async (oneRoundInfo: any) => {
                    try {
                        console.log(oneRoundInfo);
                        const openingsResponse = await axios.get(
                            `http://127.0.0.1:3000/recruitmentRounds/${oneRoundInfo.id}/openings`
                        );
                        // const studentInfo = studentResponse.data.find(
                        //   (student: any) => student.student_team_id === team_id
                        // );
                        const openingInfo = openingsResponse.data;
                        setOpenings(openingInfo);
                        console.log(data);
                        console.log("openingInfo");
                        console.log(openingInfo);

                        if (openingInfo) {
                            return {
                                round_name: oneRoundInfo.round_name,
                                opening_name: openingInfo.opening_name,
                                team_leads_allocated: "TODO",
                            };
                        }
                        return null;
                    } catch (error) {
                        console.error(
                            `Error fetching student info for profile ${oneRoundInfo.profile_id}:`,
                            error
                        );
                        return null;
                    }
                });
                // console.log(membersPromises)
                // const resolvedOpenings = await Promise.all(openingPromises);
                // console.log("resolvedOpenings")
                // console.log(resolvedOpenings)
                // setOpenings(
                //   resolvedOpenings.filter(
                //     (opening): opening is any => opening !== null
                //   )
                // );
            } catch (error) {
                console.error("Error fetching team members:", error);
                // setError("Failed to fetch team members");
            } finally {
                setLoading(false);
            }
        };

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
                                      <TableCell>{opening.recruitment_round_id}</TableCell>
                                      <TableCell>{opening.title}</TableCell>
                                      <TableCell>{opening.teamLeadsAllocated}</TableCell>
                                      <TableCell>
                                          <Button
                                              variant="contained"
                                              onClick={() => handleAllocate(opening.id)}
                                          >
                                              {opening.teamLeadsAllocated > 0
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
