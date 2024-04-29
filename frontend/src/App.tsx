import React from "react";
import { Link, Route, Routes } from "react-router-dom";

import LoginPage from "../src/screens/LoginPage";
import RegisterPage from "../src/screens/RegisterPage";
import RecruitmentPage from "../src/screens/RecruitmentPage";
import ViewApplication from "../src/screens/ViewApplication";

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<RecruitmentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ValidationTextFields" element={<ViewApplication />} />
      </Routes>
    </>
  );
}

export default App; 
