import { Route, Routes } from "react-router-dom";
import AppBarOnBoarder from "./components/AppBarOnboarder";

import LoginPage from "../src/screens/LoginPage";
import RegisterPage from "../src/screens/RegisterPage";
import RecruitmentPage from "../src/screens/RecruitmentPage";
import RecruitmentRoundDetailsPage from "./screens/RecruitmentRoundDetailsPage";

function App() {
  return (
    <>
      <AppBarOnBoarder />
      <Routes>
        <Route path="/" element={<RecruitmentRoundDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/recruitment-details-page"
          element={<RecruitmentRoundDetailsPage />}
        />
      </Routes>
    </>
  );
}

export default App;
