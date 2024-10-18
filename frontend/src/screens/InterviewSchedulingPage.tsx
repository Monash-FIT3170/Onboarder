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
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import BackIcon from "../assets/BackIcon";
import { useNavigate } from "react-router-dom";
import { useOpeningStore } from "../util/stores/openingStore";
import { useApplicantStore } from "../util/stores/applicantStore";
import { useRecruitmentStore } from "../util/stores/recruitmentStore";
import { useAuthStore } from "../util/stores/authStore";
import { getBaseAPIURL } from "../util/Util";
import axios from "axios";
import { useStudentTeamStore } from "../util/stores/studentTeamStore";
import PermissionButton from "../components/PermissionButton";

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

const InterviewSchedulingPage = () => {
  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState<RoundProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<SingleApplicationProps[]>(
    [],
  );
  const authStore = useAuthStore();
  const { setSelectedApplicant, selectedApplicant } = useApplicantStore();
  const recruitmentDetails = useRecruitmentStore(
    (state) => state.recruitmentDetails,
  );
  const filteredApplications = applications.filter((application) =>
    application.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const interviewScheduledCount = applications.filter(
    (app) => app.interview_date != null,
  ).length;
  const interviewNotScheduledCount = applications.filter(
    (app) => app.interview_date == null,
  ).length;

  const availabilitySubmittedCount = applications.filter(
    (app) => app.candidate_availability != null,
  ).length;

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const navigate = useNavigate();
  const BASE_API_URL = getBaseAPIURL();

  // Store hooks
  const studentTeamStore = useStudentTeamStore();
  const selectedOpening = useOpeningStore((state) => state.selectedOpening);

  // Effect hooks
  // useEffect(() => {
  //   if (!selectedOpening) {
  //     navigate("/opening-details");
  //     return;
  //   }

  //   const fetchData = async () => {
  //     // Get application info
  //     try {
  //       const applicationsResponse = await axios.get(
  //         `${BASE_API_URL}/opening/${selectedOpening.id}/application`,
  //       );
  //       setApplications(applicationsResponse.data);
  //       const roundResponse = await axios.get(
  //         `${BASE_API_URL}/recruitment-round/${selectedOpening.recruitment_round_id}/`,
  //       );

  //       setRound(roundResponse.data[0]);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [selectedOpening, navigate]);

  const fetchData = async () => {
    try {
      const applicationsResponse = await axios.get(
        `${BASE_API_URL}/opening/${selectedOpening?.id}/application`,
      );
      const onlyCandidate = applicationsResponse.data.filter(
        (app) => app.status == "C",
      );
      setApplications(onlyCandidate);
      const roundResponse = await axios.get(
        `${BASE_API_URL}/recruitment-round/${selectedOpening?.recruitment_round_id}/`,
      );
      setRound(roundResponse.data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedOpening) {
      navigate("/opening-details");
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
        opening_id: selectedOpening?.id || 0,
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
      const response = await axios.post(
        `${BASE_API_URL}/create-calendar-events`,
        eventData,
      );

      const failedInvites = response.data.results.filter(
        (result: any) => result.success === false,
      );

      if (failedInvites.length > 0) {
        alert("Error: Some Google Calendar Invites failed to send.");
      } else {
        // Notify user of successful submission
        alert("Google Calendar Invites have been sent to all candidates.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error sending calendar invites");
      alert("Oops! Something went wrong. Please try again later.");
      setLoading(false);
    } finally {
      if (selectedOpening) {
        selectedOpening.calendar_invites_sent = true;
      }
      setLoading(false);
    }
  };

  const handleScheduleInterviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${BASE_API_URL}/opening/${selectedOpening?.id}/schedule-interviews/`,
      );

      if (response.data.optimisationSuccess === false) {
        setError("Optimisation script failed");
        setSnackbar({
          open: true,
          message: "Optimisation script failed",
          severity: "error",
        });
        setLoading(false);
        return false;
      }

      fetchData();
      setSnackbar({
        open: true,
        message: "Successfully scheduled interviews",
        severity: "success",
      });
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
        setSnackbar({
          open: true,
          message: "An error occurred while scheduling interviews",
          severity: "error",
        });
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
        <TableCell>
          {application?.profile?.email || "No Interviewer Allocated"}
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedApplicant({
                opening_title: selectedOpening?.title || null,
                recruitment_round_name: recruitmentDetails.roundName,
                applicant_email: application.email,
                opening_name: selectedOpening?.title || null,
                application_id: application.id,
                opening_id: selectedOpening?.id || null,
                recruitment_round_id: recruitmentDetails.roundId,
                student_team_name: selectedOpening?.student_team_name || null,
                application_count: null,
                interview_date: application.interview_date,
              });
              navigate(`/manually-schedule-interview`);
            }}
            disabled={loading}
          >
            Manually Add Interview
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      {/* The button */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate("/opening-details")}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ ml: 2 }}>
            Interview Scheduling
          </Typography>
        </Box>
        {/* button to send interivew and schedule intervies */}
        <Box display="flex" alignItems="center">
          <Tooltip
            title={
              interviewScheduledCount == 0
                ? "No interviews have been scheduled yet"
                : selectedOpening?.calendar_invites_sent
                  ? "Calendar invites have already been sent"
                  : ""
            }
            arrow
          >
            <span>
              <PermissionButton
                action="send"
                subject="Interview"
                variant="contained"
                onClick={handleSendInvite}
                disabled={
                  loading ||
                  interviewScheduledCount == 0 ||
                  selectedOpening?.calendar_invites_sent
                }
                style={{ marginLeft: "1rem" }}
                tooltipText="You do not have permission to send interview invites"
              >
                {loading ? <Skeleton width={100} /> : "SEND INTERVIEW INVITES"}
              </PermissionButton>
            </span>
          </Tooltip>
          <Tooltip
            title={
              availabilitySubmittedCount == 0
                ? "No candidates have submitted availabilities"
                : selectedOpening?.interview_allocation_status === "S"
                  ? "Interviews have already been scheduled"
                  : ""
            }
            arrow
          >
            <span>
              <PermissionButton
                action="schedule"
                subject="Interview"
                variant="contained"
                onClick={handleScheduleInterviews}
                disabled={
                  loading ||
                  availabilitySubmittedCount == 0 ||
                  selectedOpening?.interview_allocation_status === "S"
                }
                style={{ marginLeft: "1rem" }}
                tooltipText="You do not have permission to schedule interviews"
              >
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  "Run Scheduling Algorithm"
                )}
              </PermissionButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
      {/* The table of the of the interview avaliability */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableRow>
            <TableCell>Recruitment Round</TableCell>
            <TableCell>Opening</TableCell>
            <TableCell>Interview Preference Deadline</TableCell>
            <TableCell>Interviews Scheduled</TableCell>
            <TableCell>Calendar Invites Sent</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{`${authStore.team_name} ${selectedOpening?.recruitment_round_id}`}</TableCell>
            <TableCell>{selectedOpening?.title}</TableCell>
            <TableCell>
              {round?.interview_preference_deadline
                ? new Date(round.interview_preference_deadline).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    },
                  )
                : "No Deadline"}
            </TableCell>
            <TableCell>
              {interviewScheduledCount > 0
                ? "Yes (" +
                  interviewScheduledCount +
                  "/" +
                  (interviewScheduledCount + interviewNotScheduledCount) +
                  ")"
                : "No"}
            </TableCell>
            <TableCell>
              {selectedOpening?.calendar_invites_sent ? "Yes" : "No"}
            </TableCell>
          </TableRow>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="space-between" sx={{ mt: 2, mb: 1 }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h5">Candidates</Typography>
        </Box>
        <TextField
          id="outlined-search"
          label="Search"
          type="search"
          value={searchTerm}
          sx={{ width: "25%" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Interview Preference Submitted</TableCell>
              <TableCell>Interview Date</TableCell>
              <TableCell>Interviewer</TableCell>
              <TableCell>Actions</TableCell>
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InterviewSchedulingPage;
