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
  profile_id: string;
  profile: { email: string };
}

export interface InterviewEventProps {
  interview_start_time: string;
  applicant_email: string;
  interviewers: string[];
  organizer_name: string;
  zoom_link: string;
}

export interface Interview {
  email: string; // Applicant email
  profile_id: number; // Interviewer ID
  interview_date: Date;
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
                second: "2-digit",
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
      // Get application info
      try {
        const applicationsResponse = await axios.get(
          `${BASE_API_URL}/opening/${selectedOpening.id}/application`,
        );
        console.log(applicationsResponse.data);
        setApplications(applicationsResponse.data);
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

  // Mapping function
  const mapToInterviewEventProps = (
    applications: SingleApplicationProps[],
  ): InterviewEventProps[] => {
    return applications.map((application) => {
      console.log(application);
      if (
        !application.interview_date ||
        !application.email ||
        !application.profile.email ||
        !authStore.team_name
      ) {
        throw new Error("One or more required fields are null");
      }

      return {
        interview_start_time: new Date(application.interview_date)
          .toISOString()
          .replace("T", " ")
          .split(".")[0],
        applicant_email: application.email,
        interviewers: [application.profile.email],
        organizer_name: authStore.team_name,
        zoom_link: "some_link",
      };
    });
  };

  // Handler functions

  // Send invites to all applicants with interview dates
  const handleSendInvite = async (e: any) => {
    console.log(applications);
    const invitees_interviewers = applications.filter(
      (value) => value.interview_date !== null,
    );

    // FOR TESTING
    const tester_invitee = invitees_interviewers.filter(
      (value) =>
        value.email == "nhuy0018@student.monash.edu" ||
        value.email == "jcru0005@student.monash.edu",
    );
    console.log("Tester Invitee: ");
    console.log(tester_invitee);
    const eventData = mapToInterviewEventProps(tester_invitee);
    console.log("Event Data: ");
    console.log(eventData);

    e.preventDefault();
    setLoading(true);
    try {
      // Call the lambda function
      const calendarInvitesResponse = await axios.post(
        `${BASE_API_URL}/create-calendar-events`,
        eventData,
      );
      console.log(calendarInvitesResponse);
      // Notify user of successful submission
      alert("Google Calendar Invites have been sent to all candidates.");
      setLoading(false);

      // clear your form fields.
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. Please try again later.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

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
        <Box display="flex" alignItems="center">
          <Button
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
          </Button>
        </Box>
      </Box>
      <PaddingBox>
        <PaddingBox></PaddingBox>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableRow>
              <TableCell>Recruitment Round</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Interviews Scheduled</TableCell>
              <TableCell>Interviews Not Scheduled</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{`${authStore.team_name} ${selectedOpening?.recruitment_round_id}`}</TableCell>
              <TableCell>None</TableCell>
              <TableCell>{interviewScheduledCount}</TableCell>
              <TableCell>{interviewNotScheduledCount}</TableCell>
            </TableRow>
          </Table>
        </TableContainer>
        <PaddingBox></PaddingBox>
        <TextField
          id="outlined-search"
          label="Search Applicants Name"
          type="search"
          value={searchTerm} //
          onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
        />
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
