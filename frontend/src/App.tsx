import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import AppBarOnBoarder from "./components/AppBarOnboarder";

import LoginPage from "../src/screens/LoginPage";
import RegisterPage from "../src/screens/RegisterPage";
import RecruitmentRoundDetailsPage from "./screens/RecruitmentRoundDetailsPage";
import CreateOpeningPage from "../src/screens/CreateOpeningPage";
import ViewRecruitmentRoundPage from "./screens/ViewRecruitmentRoundPage";
import AddRecruitmentRoundPage from "./screens/AddRecruitmentRoundPage";
import ViewOpenPage from "../src/screens/ViewOpeningPage";
import AdminAcceptPage from "../src/screens/AdminAcceptPage";


function App() {
  return (
    <>
      <AppBarOnBoarder />
      <Box component={"section"} sx={{ padding: "20px" }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/viewrecruitmentround"
            element={<ViewRecruitmentRoundPage />}
          />
          <Route
            path="/addrecruitmentround"
            element={<AddRecruitmentRoundPage />}
          />
          <Route
            path="/recruitment-details-page"
            element={<RecruitmentRoundDetailsPage />}
          />
          <Route path="/create-opening" element={<CreateOpeningPage />} />
          <Route path="/viewopen" element={<ViewOpenPage />} />
          <Route path="/admin-acceptpage" element={<AdminAcceptPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
