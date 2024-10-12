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
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import BackIcon from "../assets/BackIcon";
import { useNavigate } from "react-router-dom";
import { useOpeningStore } from "../util/stores/openingStore";
import { useAuthStore } from "../util/stores/authStore";
import { getBaseAPIURL } from "../util/Util";
import { useStudentTeamStore } from "../util/stores/studentTeamStore";
import PermissionButton from "../components/PermissionButton";

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
  const [sendInviteLoading, setSendInviteLoading] = useState(false);
  const [scheduleInterviewsLoading, setScheduleInterviewsLoading] =
    useState(false);

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [applicationsResponse, roundResponse] = await Promise.all([
        axios.get(`${BASE_API_URL}/opening/${selectedOpening?.id}/application`),
        axios.get(
          `${BASE_API_URL}/recruitment-round/${selectedOpening?.recruitment_round_id}/`,
        ),
      ]);
      setApplications(applicationsResponse.data);
      setRound(roundResponse.data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedOpening, BASE_API_URL]);

  useEffect(() => {
    if (!selectedOpening) {
      navigate("/viewopen");
      return;
    }
    fetchData();
  }, [selectedOpening, navigate, fetchData]);

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
  const handleSendInvite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!applications.length) {
      setError("No applications found.");
      return;
    }
    const invitees_interviewers = applications.filter(
      (value) => value.interview_date !== null,
    );
    if (!invitees_interviewers.length) {
      setError("No applicants with interview dates found.");
      return;
    }

    const eventData = mapToInterviewEventProps(invitees_interviewers);

    setSendInviteLoading(true);
    setError(null);
    try {
      await axios.post(`${BASE_API_URL}/create-calendar-events`, eventData);
      alert("Google Calendar Invites have been sent to all candidates.");
    } catch (error) {
      console.error("Error sending invites:", error);
      setError("Failed to send invites. Please try again later.");
    } finally {
      setSendInviteLoading(false);
    }
  };

  const handleScheduleInterviews = async () => {
    setScheduleInterviewsLoading(true);
    setError(null);
    try {
      await axios.post(
        `${BASE_API_URL}/opening/${selectedOpening?.id}/schedule-interviews/`,
      );
      await fetchData();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Error response:", err.response);
        setError(
          err.response?.data?.message ||
            "An error occurred while scheduling interviews",
        );
      } else {
        console.error("Error:", err);
        setError("An unexpected error occurred while scheduling interviews");
      }
    } finally {
      setScheduleInterviewsLoading(false);
    }
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
        <Typography variant="h4">Candidate Submission Status</Typography>
      </TitleWrapper>
      <PaddingBox />
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
          <PermissionButton
            action="send"
            subject="Interview"
            variant="contained"
            onClick={handleSendInvite}
            disabled={sendInviteLoading || loading}
            style={{ marginLeft: "1rem" }}
            tooltipText="You do not have permission to send interview invites"
          >
            {sendInviteLoading ? (
              <CircularProgress size={24} />
            ) : (
              "SEND INTERVIEW INVITES"
            )}
          </PermissionButton>

          <PermissionButton
            action="schedule"
            subject="Interview"
            variant="contained"
            onClick={handleScheduleInterviews}
            disabled={scheduleInterviewsLoading || loading}
            style={{ marginLeft: "1rem" }}
            tooltipText="You do not have permission to schedule interviews"
          >
            {scheduleInterviewsLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Schedule Interviews"
            )}
          </PermissionButton>
        </Box>
      </Box>
      <PaddingBox>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="recruitment round info">
            <TableHead>
              <TableRow>
                <TableCell>Recruitment Round</TableCell>
                <TableCell>Interview Preference Deadline</TableCell>
                <TableCell>Interviews Scheduled</TableCell>
                <TableCell>Interviews Not Scheduled</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
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
            </TableBody>
          </Table>
        </TableContainer>
        <PaddingBox />
        <TextField
          id="outlined-search"
          label="Search by name"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
        />
      </PaddingBox>

      <TableContainer component={Paper}>
        <Table aria-label="applications table">
          <TableHead>
            <TableRow>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Interview Preference Submitted</TableCell>
              <TableCell>Interview Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
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
                      <Skeleton variant="rectangular" width={80} height={30} />
                    </TableCell>
                  </TableRow>
                ))
              : generateRowFunction(filteredApplications)}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ViewInterviewAllocation;
