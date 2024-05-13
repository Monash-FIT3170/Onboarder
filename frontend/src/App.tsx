import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import AppBarOnBoarder from "./components/AppBarOnboarder";

import LoginPage from "../src/screens/LoginPage";
import RegisterPage from "../src/screens/RegisterPage";
// import RecruitmentPage from "../src/screens/RecruitmentPage";
import RecruitmentRoundDetailsPage from "./screens/RecruitmentRoundDetailsPage";

function App() {
  return (
    <>
      <AppBarOnBoarder />
      <Box component={"section"} sx={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<RecruitmentRoundDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/recruitment-details-page"
            element={<RecruitmentRoundDetailsPage />}
          />
        </Routes>
      </Box>
    </>
  );
}

export default App;
