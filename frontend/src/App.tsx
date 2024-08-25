import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import AppBarOnBoarder from "./components/AppBarOnboarder";

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
// import CreateStudentTeam from "./screens/CreateStudentTeamModal";
import theme from "./assets/Theme";
import ViewInterviewAllocation from "./screens/ViewInterviewAllocation";
import Feedbacknote from "./screens/FeedbackNote"

function App() {
	return (
		<ThemeProvider theme={theme}>
			<AppBarOnBoarder />
			<Box component={"section"} sx={{ padding: "20px" }}>
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route element={<ProtectedRoute />}>
						<Route path="/dashboard" element={<Dashboard />} />
						{/* <Route path="/createstudentteam" element={<CreateStudentTeam />} /> */}
						<Route path="/viewrecruitmentround" element={<ViewRecruitmentRoundPage />} />
						<Route path="/addrecruitmentround" element={<AddRecruitmentRoundPage />} />
						<Route path="/recruitment-details-page" element={<RecruitmentRoundDetailsPage />} />
						<Route path="/create-opening" element={<CreateOpeningPage />} />
						<Route path="/viewopen" element={<ViewOpenPage />} />
						<Route path="/applicant-openings" element={<ApplicantOpenings />} />
						<Route path="/application-submission" element={<ApplicationSubmissionPage />} />
						<Route path="/admin-acceptpage" element={<AdminAcceptPage />} />
						<Route path="/task-email-format" element={<TaskEmailFormatPage />} />
						<Route path="/availability-calendar" element={<AvailabilityCalendar />} />
						<Route path="/feedbacknote" element={<Feedbacknote />} />
						<Route path="/view-interview-allocation" element={<ViewInterviewAllocation />} />
					</Route>
					<Route path="/availability-calendar/:id" element={<AvailabilityCalendar />} />


				</Routes>
        
			</Box>
		</ThemeProvider>
	);
}

export default App;
