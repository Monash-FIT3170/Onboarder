import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
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

function App() {
	return (
		<>
			<AppBarOnBoarder />
			<Box component={"section"} sx={{ padding: "20px" }}>
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route element={<ProtectedRoute />}>
						<Route path="/viewrecruitmentround" element={<ViewRecruitmentRoundPage />} />
						<Route path="/addrecruitmentround" element={<AddRecruitmentRoundPage />} />
						<Route path="/recruitment-details-page" element={<RecruitmentRoundDetailsPage />} />
						<Route path="/create-opening" element={<CreateOpeningPage />} />
						<Route path="/viewopen" element={<ViewOpenPage />} />
						<Route path="/applicant-openings" element={<ApplicantOpenings />} />
						<Route path="/application-submission" element={<ApplicationSubmissionPage />} />
						<Route path="/admin-acceptpage" element={<AdminAcceptPage />} />
						<Route path="/task-email-format" element={<TaskEmailFormatPage />} />
					</Route>
				</Routes>
			</Box>
		</>
	);
}

export default App;
