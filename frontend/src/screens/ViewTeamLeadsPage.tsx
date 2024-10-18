import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import { useAuthStore } from "../util/stores/authStore";
import { TeamMember } from "../components/TeamMembersTable";
import { useNavigate } from "react-router-dom";
import { useMemberStore } from "../util/stores/memberStore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getBaseAPIURL } from "../util/Util";
import RoleIcon from "../util/RoleIcon";
// Define the structure of a Team Lead
export interface TeamLeadProps {
  profile_id: number;
  email: string;
}

function ViewTeamLeadsPage() {
  const navigate = useNavigate();
  // State to store the list of team leads
  const [teamLeads, setTeamLeads] = useState<TeamLeadProps[]>([]);
  const { team_id, team_name } = useAuthStore();
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const setSelectedMember = useMemberStore((state) => state.setSelectedMember);
  // const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the team leads data from the API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      const BASE_API_URL = getBaseAPIURL();
      if (!team_id) {
        setError("No team selected");
        setLoading(false);
        return;
      }

      try {
        // First API call to get member info
        const profileTeamResponse = await axios.get(
          `${BASE_API_URL}/student-team/${team_id}/members`,
        );
        const profileTeamInfo = profileTeamResponse.data;
        if (profileTeamInfo.length === 0) {
          throw new Error("Profile team information not found");
        }

        // Fetch student information for each member
        const membersPromises = profileTeamInfo.map(async (memberInfo: any) => {
          try {
            const studentResponse = await axios.get(
              `${BASE_API_URL}/profile/${memberInfo.profile_id}`,
            );
            const studentInfo = studentResponse.data[0];

            if (studentInfo) {
              return {
                email: studentInfo.email,
                profile_id: memberInfo.profile_id,
              };
            }
            return null;
          } catch (error) {
            console.error(
              `Error fetching student info for profile ${memberInfo.profile_id}:`,
              error,
            );
            return null;
          }
        });

        const resolvedMembers = await Promise.all(membersPromises);
        setMembers(
          resolvedMembers.filter(
            (member): member is TeamMember => member !== null,
          ),
        );
      } catch (error) {
        console.error("Error fetching team members:", error);
        setError("Failed to fetch team members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [team_id]);

  const handleView = (id: number, email: string) => {
    setSelectedMember({
      id: id ?? null,
      email: email ?? "",
    });
    navigate("/allocate-team-leads");
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton animation="wave" height={40} />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" height={40} width={100} />
              </TableCell>
            </TableRow>
          ))}
        </>
      );
    }

    if (members.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={2}>
            <Typography align="center">No team leads found.</Typography>
          </TableCell>
        </TableRow>
      );
    }

    return members.map((teamLead) => (
      <TableRow key={teamLead.profile_id}>
        <TableCell>
          <div style={{ display: "flex", alignItems: "center" }}>
            <RoleIcon role="Team Lead" />
            {teamLead.email}
          </div>
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            onClick={() => handleView(teamLead.profile_id, teamLead.email)}
          >
            View
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" textAlign="center">
          Team Leads
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="10px"
      >
        <Typography variant="h5">List of Team Leads</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="openings table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ViewTeamLeadsPage;
