import { Box } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import AppBarOnBoarder from "./components/AppBarOnboarder";
import { ThemeProvider } from "./util/ThemeContext"; // Import our custom ThemeProvider

// Import the necessary screens
import CreateOpeningPage from "../src/screens/CreateOpeningPage";
import LoginPage from "../src/screens/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AddRecruitmentRoundPage from "./screens/AddRecruitmentRoundPage";
import AllocateTeamLeadsPage from "./screens/AllocateTeamLeadsPage";
import ApplicationSubmissionPage from "./screens/ApplicationSubmissionPage";
import CandidateAvailabilityCalendarPage from "./screens/CandidateAvailabilityCalendarPage";
import DashboardPage from "./screens/DashboardPage";
import InterviewFeedbackPage from "./screens/InterviewFeedbackPage";
import InterviewSchedulingPage from "./screens/InterviewSchedulingPage";
import ManuallyScheduleInterviewPage from "./screens/ManuallyScheduleInterviewPage";
import OnboarderOpeningsPage from "./screens/OnboarderOpeningsPage";
import OpeningDetailsPage from "./screens/OpeningDetailsPage";
import RecruitmentRoundDetailsPage from "./screens/RecruitmentRoundDetailsPage";
import ReviewApplicantPage from "./screens/ReviewApplicantPage";
import UserAvailabilityCalendarPage from "./screens/UserAvailabilityCalendarPage";
import ViewRecruitmentRoundsPage from "./screens/ViewRecruitmentRoundsPage";
import ViewTeamLeadsPage from "./screens/ViewTeamLeadsPage";
import ViewTeamMembersPage from "./screens/ViewTeamMembersPage";

/**
 * Main App component
 * Ensure that you update the pathToNameMap in the AppBar when you add a new route.
 */
function App() {
  return (
    <ThemeProvider>
      <AppBarOnBoarder />
      <Box component={"section"} sx={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* <Route path="/" element={<LoginPage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/allocate-team-leads"
              element={<AllocateTeamLeadsPage />}
            />
            <Route path="/view-team-leads" element={<ViewTeamLeadsPage />} />
            {/* <Route path="/createstudentteam" element={<CreateStudentTeam />} /> */}
            <Route
              path="/view-recruitment-rounds"
              element={<ViewRecruitmentRoundsPage />}
            />
            <Route
              path="/add-recruitment-round"
              element={<AddRecruitmentRoundPage />}
            />
            <Route
              path="/recruitment-round-details"
              element={<RecruitmentRoundDetailsPage />}
            />
            <Route path="/create-opening" element={<CreateOpeningPage />} />
            <Route path="/opening-details" element={<OpeningDetailsPage />} />
            <Route path="/review-applicant" element={<ReviewApplicantPage />} />

            <Route
              path="/candidate-availability-calendar"
              element={<CandidateAvailabilityCalendarPage />}
            />
            <Route
              path="/interview-feedback"
              element={<InterviewFeedbackPage />}
            />
            <Route
              path="/interview-scheduling"
              element={<InterviewSchedulingPage />}
            />
            <Route
              path="/user-availability-calendar"
              element={<UserAvailabilityCalendarPage />}
            />
            <Route
              path="/view-team-members"
              element={<ViewTeamMembersPage />}
            />
            <Route
              path="/manually-schedule-interview"
              element={<ManuallyScheduleInterviewPage />}
            />
          </Route>
          <Route
            path="/candidate-availability-calendar/:id"
            element={<CandidateAvailabilityCalendarPage />}
          />
          <Route
            path="/onboarder-openings"
            element={<OnboarderOpeningsPage />}
          />
          <Route
            path="/application-submission"
            element={<ApplicationSubmissionPage />}
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;
