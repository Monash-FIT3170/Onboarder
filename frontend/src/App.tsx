import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { ThemeProvider } from "./util/ThemeContext"; // Import our custom ThemeProvider
import AppBarOnBoarder from "./components/AppBarOnboarder";

// Import the necessary screens
import AllocateTeamLeads from "./screens/AllocateTeamLeads";
import LoginPage from "../src/screens/LoginPage";
import RecruitmentRoundDetailsPage from "./screens/RecruitmentRoundDetailsPage";
import CreateOpeningPage from "../src/screens/CreateOpeningPage";
import ViewRecruitmentRoundPage from "./screens/ViewRecruitmentRoundPage";
import AddRecruitmentRoundPage from "./screens/AddRecruitmentRoundPage";
import ViewOpenPage from "../src/screens/ViewOpeningPage";
import ApplicantOpenings from "./screens/ApplicantOpenings";
import ApplicationSubmissionPage from "./screens/ApplicationSubmissionPage";
import AdminAcceptPage from "../src/screens/AdminAcceptPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TaskEmailFormatPage from "./screens/TaskEmailFormatPage";
import AvailabilityCalendar from "./screens/AvailabilityCalendar";
import Dashboard from "./screens/Dashboard";
import ViewTeamMemberPage from "./screens/ViewTeamMemberPage";
import ViewInterviewAllocation from "./screens/ViewInterviewAllocation";
import Feedbacknote from "./screens/FeedbackNote";
import AvailabilityCalendarUser from "./screens/AvailabilityCalendarUser";
import ViewTeamLeads from "./screens/ViewTeamLeads";

function App() {
  return (
    <ThemeProvider>
      <AppBarOnBoarder />
      <Box component={"section"} sx={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/allocate-team-leads"
              element={<AllocateTeamLeads />}
            />
            <Route path="/view-team-leads" element={<ViewTeamLeads />} />
            {/* <Route path="/createstudentteam" element={<CreateStudentTeam />} /> */}
            <Route
              path="/view-recruitment-rounds"
              element={<ViewRecruitmentRoundPage />}
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
            <Route path="/opening-details" element={<ViewOpenPage />} />
            <Route path="/review-applicant" element={<AdminAcceptPage />} />
            <Route
              path="/task-email-format"
              element={<TaskEmailFormatPage />}
            />
            <Route
              path="/candidate-availability-calendar"
              element={<AvailabilityCalendar />}
            />
            <Route path="/interview-feedback" element={<Feedbacknote />} />
            <Route
              path="/interview-scheduling"
              element={<ViewInterviewAllocation />}
            />
            <Route
              path="/user-availability-calendar"
              element={<AvailabilityCalendarUser />}
            />
            <Route path="/view-team-members" element={<ViewTeamMemberPage />} />
          </Route>
          <Route
            path="/candidate-availability-calendar/:id"
            element={<AvailabilityCalendar />}
          />
          <Route path="/onboarder-openings" element={<ApplicantOpenings />} />
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
