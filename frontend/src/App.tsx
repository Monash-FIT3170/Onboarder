// @ts-ignore
import React from "react";
import { Link, Route, Routes } from "react-router-dom";

import LoginPage from "../src/screens/LoginPage";
import RegisterPage from "../src/screens/RegisterPage";
import RecruitmentPage from "../src/screens/RecruitmentPage";
import ViewOpenPage from "../src/screens/ViewOpeningPage";

function App() {
  return (
    <>
      <h1>Onboarder</h1>
      <Routes>
        <Route path="/" element={<RecruitmentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/viewopen" element={<ViewOpenPage />} />
      </Routes>
    </>
  );
}

export default App;
