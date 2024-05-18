import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import AppBarOnBoarder from "./components/AppBarOnboarder";

import LoginPage from "../src/screens/LoginPage";
import RegisterPage from "../src/screens/RegisterPage";
import RecruitmentPage from "../src/screens/RecruitmentPage";
import ApplicantOpenings from "../src/screens/ApplicantOpenings";

function App() {
  return (
    <>
      <AppBarOnBoarder />
      <Routes>
        <Route path="/" element={<RecruitmentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/applicant-opening" element={<ApplicantOpenings />} />
      </Routes>
    </>
  );
}

export default App;
