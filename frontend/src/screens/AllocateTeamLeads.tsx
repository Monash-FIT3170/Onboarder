import { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box,
  IconButton,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useMemberStore } from "../util/stores/memberStore";
import { useAuthStore } from "../util/stores/authStore";
import { getBaseAPIURL } from "../util/Util";
import PermissionButton from "../components/PermissionButton";

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

const AllocateTeamLeads = () => {
  const [openings, setOpenings] = useState<any[]>([]);
  const [counts, setCounts] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BASE_API_URL = getBaseAPIURL();

  const navigate = useNavigate();
  const selectedMember = useMemberStore((state) => state.selectedMember);
  const { team_id } = useAuthStore();
  const teamLeadId = selectedMember?.id;

  const handleApiError = useCallback(
    (error: unknown, defaultMessage: string) => {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message ||
            axiosError.message ||
            defaultMessage,
        );
      } else {
        setError(defaultMessage);
      }
    },
    [],
  );

  const fetchAllocationRowsData = useCallback(async () => {
    if (!team_id) {
      setError("No team selected. Please select a team and try again.");
      setLoading(false);
      return;
    }

    setError(null);
    try {
      const fetchRoundInfo = async (teamId: number): Promise<RoundInfo[]> => {
        const response = await axios.get(
          `${BASE_API_URL}/student-team/${teamId}/recruitment-round`,
        );
        if (response.data.length === 0) {
          throw new Error("Profile team information not found");
        }
        return response.data;
      };

      const fetchOpenings = async (roundId: number): Promise<Opening[]> => {
        const response = await axios.get(
          `${BASE_API_URL}/recruitment-round/${roundId}/opening`,
        );
        return response.data;
      };

      const fetchLeadCounts = async (
        openingId: number,
      ): Promise<AllocatedMember[]> => {
        const response = await axios.get(
          `${BASE_API_URL}/opening/${openingId}/team-lead-assign`,
        );
        return response.data;
      };

      const fetchAssignments = async (
        openingId: number,
        teamLeadId: number,
      ): Promise<Assignment[]> => {
        const response = await axios.get(
          `${BASE_API_URL}/opening/${openingId}/team-lead-assign/${teamLeadId}`,
        );
        return response.data;
      };

      const roundInfo = await fetchRoundInfo(team_id);

      const openingsResults = await Promise.allSettled(
        roundInfo.map(async (oneRoundInfo) => {
          const openings = await fetchOpenings(oneRoundInfo.id);
          return openings.map((opening) => ({
            ...opening,
            round_name: oneRoundInfo.round_name,
          }));
        }),
      );

      const allOpenings = openingsResults
        .filter(
          (result): result is PromiseFulfilledResult<Opening[]> =>
            result.status === "fulfilled",
        )
        .flatMap((result) => result.value);

      setOpenings(allOpenings);

      const countsResults = await Promise.allSettled(
        allOpenings.map((opening) => fetchLeadCounts(opening.id)),
      );

      const allCounts = countsResults
        .filter(
          (result): result is PromiseFulfilledResult<AllocatedMember[]> =>
            result.status === "fulfilled",
        )
        .flatMap((result) => result.value);

      setCounts(allCounts);

      if (teamLeadId) {
        const assignmentsResults = await Promise.allSettled(
          allOpenings.map((opening) =>
            fetchAssignments(opening.id, teamLeadId),
          ),
        );

        const allAssignments = assignmentsResults
          .filter(
            (result): result is PromiseFulfilledResult<Assignment[]> =>
              result.status === "fulfilled",
          )
          .flatMap((result) => result.value);

        setAssignments(allAssignments);
      }
    } catch (error) {
      handleApiError(error, "Error fetching team openings");
    } finally {
      setLoading(false);
    }
  }, [team_id, teamLeadId, BASE_API_URL, handleApiError]);

  const handleAllocate = useCallback(
    async (openingId: number) => {
      if (!teamLeadId || !openingId) {
        setError("Invalid team lead or opening. Please try again.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const API_URL = `${BASE_API_URL}/opening/${openingId}/team-lead-assign`;
        await axios.post(API_URL, {
          profile_id: teamLeadId,
        });
        await fetchAllocationRowsData();
      } catch (error) {
        handleApiError(error, "Error allocating team lead");
      } finally {
        setLoading(false);
      }
    },
    [BASE_API_URL, teamLeadId, fetchAllocationRowsData, handleApiError],
  );

  const handleDeAllocate = useCallback(
    async (openingId: number) => {
      if (!teamLeadId || !openingId) {
        setError("Invalid team lead or opening. Please try again.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const API_URL = `${BASE_API_URL}/opening/${openingId}/team-lead-assign/${teamLeadId}`;
        await axios.delete(API_URL);
        await fetchAllocationRowsData();
      } catch (error) {
        handleApiError(error, "Error deallocating team lead");
      } finally {
        setLoading(false);
      }
    },
    [BASE_API_URL, teamLeadId, fetchAllocationRowsData, handleApiError],
  );

  useEffect(() => {
    fetchAllocationRowsData();
  }, [fetchAllocationRowsData]);

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
        <Typography variant="h6">
          {selectedMember?.email || "No member selected"}
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
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
                      item.opening_id === opening.id,
                  );
                  const allocatedCount =
                    counts.find((item) => item.opening_id === opening.id)
                      ?.team_leads_allocated || 0;
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
                          <PermissionButton
                            action="assign"
                            subject="Opening"
                            variant="contained"
                            onClick={() => handleAllocate(opening.id)}
                            tooltipText="You do not have permission to allocate team leads"
                            disabled={!teamLeadId}
                          >
                            Allocate
                          </PermissionButton>
                        ) : (
                          <PermissionButton
                            action="update"
                            subject="Opening"
                            variant="outlined"
                            onClick={() => handleDeAllocate(opening.id)}
                            tooltipText="You do not have permission to deallocate team leads"
                            disabled={!teamLeadId}
                          >
                            Deallocate
                          </PermissionButton>
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
