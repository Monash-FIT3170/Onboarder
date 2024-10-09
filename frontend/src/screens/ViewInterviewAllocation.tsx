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
import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import BackIcon from "../assets/BackIcon";
import { useNavigate } from "react-router-dom";
import { useOpeningStore } from "../util/stores/openingStore";
import { useAuthStore } from "../util/stores/authStore";
import { getBaseAPIURL } from "../util/Util";
import { useStudentTeamStore } from "../util/stores/studentTeamStore";

// Css file
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

// Import the back end
export interface SingleApplicationProps {
  id: number; // application id
  opening_id: number; // Appilication opening id
  email: string; // email
  name: string; // name
  phone: string; // mobile phone number
  semesters_until_completion: number; // semester
  current_semester: number; // current semester
  course_enrolled: string; // course enrolled
  major_enrolled: string; // major enrolled
  cover_letter: string; // cover letter
  skills: string[]; // skills
  accepted: string; // status acception
  created_at: string; // created placed
  interview_date: string; // interview date
  candidate_availability: string; // availability
  profile_id: string; // profile id
  profile: { email: string }; // profile
}

export interface InterviewEventProps {
  interview_start_time: string; // starting time
  applicant_email: string; // email
  interviewers: string[]; // interviewers
  organizer_name: string; // organizer name
  meeting_link: string; // link
}

export interface Interview {
  email: string; // Applicant email
  profile_id: number; // Interviewer ID
  interview_date: Date;
}

export interface RoundProps {
  id: number; // round id
  student_team_id: number; //student id
  semester: string; // semester
  year: number; // year
  status: string; // status
  application_deadline: string; // deadline
  interview_preference_deadline: string; // interview preference
  interview_period: string[]; // period
}

const ViewInterviewAllocation = () => {
  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState<RoundProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<SingleApplicationProps[]>(
    [],
  );

  // Constants
  const navigate = useNavigate();
  const BASE_API_URL = getBaseAPIURL();
  const filteredApplications = applications.filter((application) =>
    application.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const interviewScheduledCount = applications.filter(
    (app) => app.interview_date != null,
  ).length;
  const interviewNotScheduledCount = applications.filter(
    (app) => app.interview_date == null,
  ).length;

  // Store hooks
  const authStore = useAuthStore();
  const studentTeamStore = useStudentTeamStore();
  const selectedOpening = useOpeningStore((state) => state.selectedOpening);

  // Effect hooks
  useEffect(() => {
    if (!selectedOpening) {
      navigate("/opening-details");
      return;
    }

    const fetchData = async () => {
      // Get application info
      try {
        const applicationsResponse = await axios.get(
          `${BASE_API_URL}/opening/${selectedOpening.id}/application`,
        );
        setApplications(applicationsResponse.data);
        const roundResponse = await axios.get(
          `${BASE_API_URL}/recruitment-round/${selectedOpening.recruitment_round_id}/`,
        );
        setRound(roundResponse.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOpening, navigate]);

  const fetchData = async () => {
    try {
      const applicationsResponse = await axios.get(
        `${BASE_API_URL}/opening/${selectedOpening?.id}/application`,
      );
      // console.log(applicationsResponse);
      setApplications(applicationsResponse.data);
      const roundResponse = await axios.get(
        `${BASE_API_URL}/recruitment-round/${selectedOpening?.recruitment_round_id}/`,
      );
      console.log(roundResponse);
      setRound(roundResponse.data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedOpening) {
      navigate("/viewopen");
      return;
    }

    fetchData();
  }, [selectedOpening, navigate]);

  // Mapping function
  const mapToInterviewEventProps = (
    applications: SingleApplicationProps[],
  ): InterviewEventProps[] => {
    const meeting_link =
      studentTeamStore.studentTeams.find(
        (item) => item.student_team_id === authStore.team_id,
      )?.student_team_meeting_link || "";
    return applications.map((application) => {
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
        meeting_link: meeting_link,
      };
    });
  };

  // Handler functions
  // Send invites to all applicants with interview dates
  const handleSendInvite = async (e: any) => {
    if (!applications) {
      alert("No applications found.");
      return;
    }
    const invitees_interviewers = applications.filter(
      (value) => value.interview_date !== null,
    );
    if (!invitees_interviewers) {
      alert("No applicants with interview dates found.");
      return;
    }

    const eventData = mapToInterviewEventProps(invitees_interviewers);

    e.preventDefault();
    setLoading(true);
    try {
      // Call the lambda function
      const calendarInvitesResponse = await axios.post(
        `${BASE_API_URL}/create-calendar-events`,
        eventData,
      );
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
  };

  const handleScheduleInterviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${BASE_API_URL}/opening/${selectedOpening?.id}/schedule-interviews/`,
      );
      console.log("res", res);
      fetchData();
    } catch (err) {
      // setError(err.message || "An error occurred while scheduling interviews");
      if (axios.isAxiosError(err)) {
        console.error("Error response data:", err.response?.data);
        console.error("Error response status:", err.response?.status);
        console.error("Error response headers:", err.response?.headers);
        setError(
          err.response?.data?.message ||
            "An error occurred while scheduling interviews",
        );
      } else {
        console.error("Error message:", err.message);
        setError(
          err.message || "An error occurred while scheduling interviews",
        );
      }
    }
    setLoading(false);
  };

  // Row generation function
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

  return (
    <>
      <TitleWrapper>
        {/* The title */}
        <Typography variant="h4">Candiate Submission Status</Typography>
      </TitleWrapper>
      <PaddingBox></PaddingBox>
      {/* The button */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate("/opening-details")}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            {selectedOpening?.title}
          </Typography>
        </Box>
        {/* button to send interivew and schedule intervies */}
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
            onClick={handleScheduleInterviews}
            disabled={loading}
            style={{ marginLeft: "1rem" }}
          >
            {loading ? <Skeleton width={100} /> : "Schedule Interviews"}
          </Button>
        </Box>
      </Box>
      <PaddingBox>
        <PaddingBox></PaddingBox>
        {/* The table of the of the interview avaliability */}
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
