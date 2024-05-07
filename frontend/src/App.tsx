import { Link, Route, Routes } from "react-router-dom";

import LoginPage from "../src/screens/LoginPage";
import RegisterPage from "../src/screens/RegisterPage";
import RecruitmentPage from "../src/screens/RecruitmentPage";
import ViewRecruitmentRoundPage from "./screens/ViewRecruitmentRoundPage";
import AddRecruitmentRoundPage from "./screens/AddRecruitmentRoundPage";

function App() {
  return (
    <>
      <h1>Onboarder</h1>
      <Routes>
        <Route path="/" element={<RecruitmentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/viewrecruitmentround" element={<ViewRecruitmentRoundPage/>} />
        <Route path="/addrecruitmentround" element={<AddRecruitmentRoundPage/>} />
      </Routes>
    </>
  );
}

export default App;
