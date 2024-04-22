import { Link, Route, Routes } from "react-router-dom";

import LoginPage from "../src/screens/LoginPage";
import RegisterPage from "../src/screens/RegisterPage";
import RecruitmentPage from "../src/screens/RecruitmentPage";
import ViewRecruitmentRoundPage from "./screens/ViewRecruitmentRoundPage";

function App() {
  return (
    <>
      <h1>Onboarder</h1>
      <ViewRecruitmentRoundPage/>
      <Routes>
        <Route path="/" element={<RecruitmentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;