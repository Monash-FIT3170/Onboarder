import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
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
  IconButton,
  Skeleton,
  Button,
} from "@mui/material";
import BackIcon from "../assets/BackIcon";
import { useNavigate } from "react-router-dom";
import { useOpeningStore } from "../util/stores/openingStore";
import { useAuthStore } from "../util/stores/authStore";
import { getBaseAPIURL } from "../util/Util";

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

export interface SingleApplicationProps {
  id: number;
  opening_id: number;
  email: string;
  name: string;
  phone: string;
  semesters_until_completion: number;
  current_semester: number;
  course_enrolled: string;
  major_enrolled: string;
  cover_letter: string;
  skills: string[];
  accepted: string;
  created_at: string;
  interview_date: string;
  candidate_availability: string;
}

export interface RoundProps {
  id: number;
  student_team_id: number;
  semester: string;
  year: number;
  status: string;
  application_deadline: string;
  interview_preference_deadline: string;
  interview_period: string[];
}

const ViewInterviewAllocation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const BASE_API_URL = getBaseAPIURL();
  // Filter by search
  // const filteredData = mockData.filter((applicant) =>
  //   applicant.applicantName.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const [loading, setLoading] = useState(true);
  const selectedOpening = useOpeningStore((state) => state.selectedOpening);
  const [round, setRound] = useState<RoundProps | null>(null);
  const clearSelectedOpening = useOpeningStore(
    (state) => state.clearSelectedOpening,
  );
  const [applications, setApplications] = useState<SingleApplicationProps[]>(
    [],
  );
  const authStore = useAuthStore();
  const filteredApplications = applications.filter((application) =>
    application.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const generateRowFunction = (applications: SingleApplicationProps[]) => {
    return applications.map((application) => (
      <TableRow key={application.id}>
        <TableCell>{application.name}</TableCell>
        <TableCell>{application.email}</TableCell>
        <TableCell>
          {application.candidate_availability != null ? "YES" : "NO"}
        </TableCell>
        <TableCell>
          {application.interview_date != null
            ? new Date(application.interview_date).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "No Interview Scheduled"}
        </TableCell>
      </TableRow>
    ));
  };

  useEffect(() => {
    if (!selectedOpening) {
      navigate("/viewopen");
      return;
    }

    const fetchData = async () => {
      try {
        const applicationsResponse = await axios.get(
          `${BASE_API_URL}/opening/${selectedOpening.id}/application`,
        );
        // console.log(applicationsResponse);
        setApplications(applicationsResponse.data);
        const roundResponse = await axios.get(
          `${BASE_API_URL}/recruitment-round/${selectedOpening.recruitment_round_id}/`,
        );
        console.log(roundResponse);
        setRound(roundResponse.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOpening, navigate]);

  // const handleBack = () => {
  //     clearSelectedOpening();
  //     navigate("/viewopen");
  // };
  const interviewScheduledCount = applications.filter(
    (app) => app.candidate_availability,
  ).length;
  const interviewNotScheduledCount = applications.filter(
    (app) => !app.candidate_availability,
  ).length;

  const respond = () => {
    // clearSelectedOpening();
    navigate("/viewopen");
  };

  const handleScheduleInterview = async () => {
    //  SCEHLUDE INTERVIEW BUTTON FUNCTIONALITY
    //    setLoading(true);
    //     setError(null);
    //     setResponse(null);
    //     try {
    //         const res = await axios.post(`${BASE_API_URL}/opening/${selectedOpening.id}/schedule-interviews`, {
    //             // Add data
    //         });
    //         setResponse(res.data);
    //         // setApplications(res.data.updatedApplications);
    //     } catch (err) {
    //         setError(err.message || "An error occurred while scheduling interviews");
    //     }
  };

  // NEXT SPRINT BUTTON
  const handleSendInvite = async () => {};

  return (
    <>
      <TitleWrapper>
        <Typography variant="h4">Candiate Submission Status</Typography>
      </TitleWrapper>
      <PaddingBox></PaddingBox>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate("/viewopen")}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            {selectedOpening?.title}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleSendInvite}
          disabled={loading}
          style={{ marginLeft: "1rem" }}
        >
          {loading ? <Skeleton width={100} /> : "Schedule Interviews"}
        </Button>
      </Box>
      <PaddingBox>
        <PaddingBox></PaddingBox>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableRow>
              <TableCell>Recruitment Round</TableCell>
              <TableCell>Interview Preference Deadline</TableCell>
              <TableCell>Interviews Scheduled</TableCell>
              <TableCell>Interviews Not Scheduled</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`${authStore.team_name} ${selectedOpening?.recruitment_round_id}`}</TableCell>
              <TableCell>
                {round?.interview_preference_deadline
                  ? new Date(
                      round.interview_preference_deadline,
                    ).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "No Deadline"}
              </TableCell>
              <TableCell>{interviewScheduledCount}</TableCell>
              <TableCell>{interviewNotScheduledCount}</TableCell>
            </TableRow>
          </Table>
        </TableContainer>
        <PaddingBox></PaddingBox>
        <TextField
          id="outlined-search"
          label="Search"
          type="search"
          value={searchTerm} //
          onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
        />

        {/* <Button
          variant="contained"
          onClick={handleSendInvite}
          disabled={loading}
          style={{ marginLeft: "1rem" }}
        >
          {loading ? <Skeleton width={100} /> : "SEND INTERVIEW INVITES"}
        </Button>
        <Button
          variant="contained"
          onClick={handleScheduleInterview}
          disabled={loading}
          style={{ marginLeft: "1rem" }}
        >
          {loading ? <Skeleton width={100} /> : "Schedule Interviews"}
        </Button> */}
      </PaddingBox>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Interview Preference Submitted</TableCell>
              <TableCell>Interview Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              loading
                ? [...Array(3)].map((_, index) => (
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
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={30}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                : generateRowFunction(filteredApplications) // puts student info into table
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ViewInterviewAllocation;
