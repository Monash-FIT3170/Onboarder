import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import { styled } from "@mui/system";
import { supabase } from "../util/supabaseClient";
import { useNavigate } from "react-router-dom";
import loginImageLight from "../assets/onboarder_white.png";
import loginImageDark from "../assets/onboarder_black.png";
import { useTheme as useCustomTheme } from "../util/ThemeContext";
import { useAuthStore } from "../util/stores/authStore";

const FlexContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "calc(100vh - 200px)",
  minHeight: "500px",
  [theme.breakpoints.down("md")]: {
    height: "calc(100vh - 100px)",
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(30),
  [theme.breakpoints.up("md")]: {
    maxWidth: "50%",
    padding: theme.spacing(10),
  },
}));

const DarkBlueButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
  backgroundColor: "#007FFF", // Monash blue
  color: "#fff",
  "&:hover": {
    backgroundColor: "#005BB5",
  },
}));

const ImageSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const CoverImage = styled("img")({
  width: "100%",
  height: "80%",
  objectFit: "cover",
});

const LoginPage: React.FC = () => {
  const [error, setError] = useState("");
  const authStore = useAuthStore();
  const { darkMode } = useCustomTheme();

  const navigate = useNavigate();

  const handleMonashLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google", // You can replace this with your Monash SSO logic if available
        options: {
          redirectTo: "http://localhost:5173/login",
        },
      });

      if (error) console.error("Error logging in with Monash SSO:", error);
    } catch (error) {
      console.log("OAuth error");
    }
  };

  const handleApplicantLogin = () => {
    navigate("/applicant-openings");
  };

  useEffect(() => {
    // Check for OAuth errors on page load
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const errorDescription = urlParams.get("error_description");

    if (error) {
      console.error(`OAuth Error: ${error}, Description: ${errorDescription}`);

      // clearing the url params
      window.history.replaceState({}, document.title, window.location.pathname);

      if (errorDescription === "Database error saving new user") {
        setError(
          "Oops! It looks like you're not using a Monash email. Please sign in with your official Monash University email address.",
        );
      }
    }

    // Check if user is signed in on initial component render
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // authStore
        authStore.initializeAuth();
        // Redirecting user to dashboard if user is signed in
        navigate("/dashboard");
      }
    };

    checkUser();
  }, [navigate]);
  const handleOpenings = () => {
    navigate("/applicant-openings");
  };

  return (
    <FlexContainer>
      <FormSection>
        <Typography component="h1" variant="h5" gutterBottom>
          Log In
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Part of a student team? Log in with your Monash email to get started.
        </Typography>
        <DarkBlueButton
          variant="contained"
          onClick={handleMonashLogin}
          sx={{ mb: 7 }}
        >
          LOG IN VIA MONASH SSO
        </DarkBlueButton>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          Want to start your application process? Click below.
        </Typography>
        <DarkBlueButton variant="contained" onClick={handleOpenings}>
          Apply for a position
        </DarkBlueButton>

        {error && (
          <Alert
            severity="error"
            sx={{ mt: 2, width: "100%", justifyContent: "center" }}
          >
            {error}
          </Alert>
        )}
      </FormSection>
      <ImageSection>
      <CoverImage src={darkMode ? loginImageDark : loginImageLight} alt="Login illustration" />
      </ImageSection>
    </FlexContainer>
  );
};

export default LoginPage;
