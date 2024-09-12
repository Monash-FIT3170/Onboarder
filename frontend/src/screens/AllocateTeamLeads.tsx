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
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // const { teamLeadId } = useParams();

    const navigate = useNavigate();
    // const setSelectedMember = useMemberStore((state) => state.setSelectedMember);
    const selectedMember = useMemberStore((state) => state.selectedMember);
    const { team_id, team_name } = useAuthStore();
    const teamLeadId = selectedMember?.id;

    const handleAllocate = async (openingId: number) => {
        if (!teamLeadId || !openingId) {
            alert("Please fill in all fields " + teamLeadId + " " + openingId);
            return;
        }

        setLoading(true);
        try {
            const API_URL = `http://127.0.0.1:3000/opening/${openingId}/team-lead-assign`;
            await axios.post(API_URL, {
                profile_id: teamLeadId,
            });
            // console.log("Team lead allocated successfully");
            // Refresh the openings list after allocation
        } catch (error) {
            console.error("Error allocating team lead:", error);
        } finally {
            fetchAllocationRowsData();
            setLoading(false);
        }
    };

    const handleDeAllocate = async (openingId: number) => {
        if (!teamLeadId || !openingId) {
            alert("Please fill in all fields " + teamLeadId + " " + openingId);
            return;
        }

        setLoading(true);
        try {
            const API_URL = `http://127.0.0.1:3000/opening/${openingId}/team-lead-assign/${teamLeadId}`;
            await axios.delete(API_URL);
            // console.log("Team lead allocated successfully");
            // Refresh the openings list after allocation
        } catch (error) {
            console.error("Error allocating team lead:", error);
        } finally {
            fetchAllocationRowsData();
            setLoading(false);
        }
    };

    interface RoundInfo {
        id: number;
        round_name: string;
      }
      
      interface Opening {
        id: number;
        round_name: string;
        opening_title: string;
        student_team_name: string;
        recruitment_round_id: number;
      }
      
      interface AllocatedMember {
        id: number;
        opening_id: number;
        team_leads_allocated: number;
      }
      
      interface Assignment {
        id: number;
        opening_id: number;
        profile_id: number;
      }

    const fetchRoundInfo = async (teamId: number): Promise<RoundInfo[]> => {
        const response = await axios.get(
            `http://127.0.0.1:3000/student-team/${teamId}/recruitment-round`
        );
        if (response.data.length === 0) {
            throw new Error("Profile team information not found");
        }
        return response.data;
    };

    const fetchOpenings = async (roundId: number): Promise<Opening[]> => {
        const response = await axios.get(
            `http://127.0.0.1:3000/recruitment-round/${roundId}/opening`
        );
        return response.data;
    };

    const fetchLeadCounts = async (openingId: number): Promise<AllocatedMember[]> => {
        const response = await axios.get(
            `http://127.0.0.1:3000/opening/${openingId}/team-lead-assign`
        );
        console.log("Lead counts response (Allocated Member");
        console.log(response.data);
        return response.data;
    }; 

    const fetchAssignments = async (
        openingId: number,
        teamLeadId: number
    ): Promise<Assignment[]> => {
        const response = await axios.get(
            `http://127.0.0.1:3000/opening/${openingId}/team-lead-assign/${teamLeadId}`
        );
        console.log("Assignments response");
        console.log(response.data);
        return response.data;
    };

    const fetchAllocationRowsData = async () => {
        if (!team_id) {
            console.error("No team selected");
            setLoading(false);
            return;
        }

        try {
            const roundInfo = await fetchRoundInfo(team_id);

            const openingsResults = await Promise.allSettled(
                roundInfo.map(async (oneRoundInfo) => {
                    const openings = await fetchOpenings(oneRoundInfo.id);
                    return openings.map((opening) => ({
                        ...opening,
                        round_name: oneRoundInfo.round_name,
                    }));
                })
            );

            const allOpenings = openingsResults
                .filter(
                    (result): result is PromiseFulfilledResult<Opening[]> =>
                        result.status === "fulfilled"
                )
                .flatMap((result) => result.value);

            setOpenings(allOpenings);

            const countsResults = await Promise.allSettled(
                allOpenings.map((opening) => fetchLeadCounts(opening.id))
            );

            const allCounts = countsResults
                .filter(
                    (result): result is PromiseFulfilledResult<AllocatedMember[]> =>
                        result.status === "fulfilled"
                )
                .flatMap((result) => result.value);

            setCounts(allCounts);

            const assignmentsResults = await Promise.allSettled(
                allOpenings.map((opening) => fetchAssignments(opening.id, teamLeadId))
            );

            const allAssignments = assignmentsResults
                .filter(
                    (result): result is PromiseFulfilledResult<Assignment[]> =>
                        result.status === "fulfilled"
                )
                .flatMap((result) => result.value);

            setAssignments(allAssignments);
            // const profileTeamResponse = await axios.get(
            //     `http://127.0.0.1:3000/student-team/${team_id}/recruitment-round`
            // );
            // const roundInfo = profileTeamResponse.data;

            // if (roundInfo.length === 0) {
            //     throw new Error("Profile team information not found");
            // }
            // const openingPromises = roundInfo.map(async (oneRoundInfo: any) => {
            //     try {
            //         const openingsResponse = await axios.get(
            //             `http://127.0.0.1:3000/recruitment-round/${oneRoundInfo.id}/opening`
            //         );

            //         return openingsResponse.data.map((opening: any) => ({
            //             ...opening,
            //             round_name: oneRoundInfo.round_name,
            //         }));
            //     } catch (error) {
            //         console.error(`Error fetching openings for round ${oneRoundInfo.id}:`, error);
            //         return [];
            //     }
            // });

            // const resolvedOpenings = await Promise.all(openingPromises);
            // setOpenings(resolvedOpenings.flat());

            // const countPromises = resolvedOpenings.flat().map(async (oneOpeningInfo: any) => {
            //     try {
            //         const leadCountResponse = await axios.get(
            //             `http://127.0.0.1:3000/opening/${oneOpeningInfo.id}/team-lead-assign`
            //         );
            //         return leadCountResponse.data.map((allocatedMembers: any) => ({
            //             ...allocatedMembers,
            //         }));
            //     } catch (error) {
            //         console.error(`Error fetching counts for opening ${oneOpeningInfo.id}:`, error);
            //         return [];
            //     }
            // });

            // const resolvedCounts = await Promise.all(countPromises);
            // console.log("Resolved counts");
            // console.log(resolvedCounts.flat());
            // setCounts(resolvedCounts.flat());

            // const assignedStatusPromises = resolvedOpenings
            //     .flat()
            //     .map(async (oneOpeningInfo: any) => {
            //         console.log("Opening Info: ", oneOpeningInfo);
            //         try {
            //             const leadAssignedResponse = await axios.get(
            //                 `http://127.0.0.1:3000/opening/${oneOpeningInfo.id}/team-lead-assign/${teamLeadId}`
            //             );
            //             return leadAssignedResponse.data.map((assignedStatus: any) => ({
            //                 ...assignedStatus,
            //             }));
            //         } catch (error) {
            //             console.error(
            //                 `Error fetching assignments for opening ${oneOpeningInfo.id}:`,
            //                 error
            //             );
            //             return [];
            //         }
            //     });

            // const resolvedAssignments = await Promise.all(assignedStatusPromises);
            // setAssignments(resolvedAssignments.flat());
        } catch (error) {
            console.error("Error fetching team openings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllocationRowsData();
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
                            : openings.map((opening) => {
                                  const userAssigned = assignments.find(
                                      (item) =>
                                          item.profile_id === teamLeadId &&
                                          item.opening_id === opening.id
                                  );
                                  const allocatedCount =
                                      counts.find((item) => item.opening_id === opening.id)
                                          .team_leads_allocated || 0;
                                  return (
                                      <TableRow key={opening.id}>
                                          <TableCell>
                                              {opening.student_team_name +
                                                  " " +
                                                  opening.recruitment_round_id}
                                          </TableCell>
                                          <TableCell>{opening.opening_title}</TableCell>
                                          <TableCell>{allocatedCount}</TableCell>
                                          <TableCell>
                                              {!userAssigned ? (
                                                  <Button
                                                      variant="contained"
                                                      onClick={() => handleAllocate(opening.id)}
                                                  >
                                                      Allocate
                                                  </Button>
                                              ) : (
                                                  <Button
                                                      variant="outlined"
                                                      onClick={() => handleDeAllocate(opening.id)}
                                                  >
                                                      Deallocate
                                                  </Button>
                                              )}
                                          </TableCell>
                                      </TableRow>
                                  );
                              })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AllocateTeamLeads;
