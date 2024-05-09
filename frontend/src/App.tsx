import React from "react";
import { Link, Route, Routes } from "react-router-dom";

import LoginPage from "../src/screens/LoginPage";
import RegisterPage from "../src/screens/RegisterPage";
import RecruitmentPage from "../src/screens/RecruitmentPage";
import CreateOpeningPage from "../src/screens/CreateOpeningPage";

function App() {
  return (
    <>
      <h1>Onboarder</h1>
      <Routes>
        <Route path="/" element={<RecruitmentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-opening" element={<CreateOpeningPage />} />
      </Routes>
    </>
  );
}

export default App;
