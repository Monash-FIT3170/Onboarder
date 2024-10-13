import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useOpeningStore } from "../util/stores/openingStore";
import { getBaseAPIURL } from "../util/Util";
import PermissionButton from "../components/PermissionButton";

const TaskEmailFormatPage: React.FC = () => {
  const [taskOn, setTaskOn] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [emailBodyError, setEmailBodyError] = useState("");

  const BASE_API_URL = getBaseAPIURL();
  const navigate = useNavigate();
  const selectedOpening = useOpeningStore((state) => state.selectedOpening);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskOn(event.target.checked);
  };

  const handleBack = () => {
    navigate("/opening-details");
  };

  const validateEmailBody = (body: string): boolean => {
    if (taskOn && body.trim().length === 0) {
      setEmailBodyError("Email body is required when task is enabled");
      return false;
    }
    if (body.length > 1000) {
      setEmailBodyError("Email body must be less than 1000 characters");
      return false;
    }
    setEmailBodyError("");
    return true;
  };

  const handleConfirm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateEmailBody(emailBody)) return;

    setLoading(true);
    const submissionData = {
      task_enabled: taskOn,
      task_email_format: emailBody,
    };

    try {
      const response = await axios.patch(
        `${BASE_API_URL}/opening/${selectedOpening?.id}`,
        submissionData,
      );
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Task Updated!",
          severity: "success",
        });
        setTimeout(handleBack, 2000);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("There was an error!", error);
      setSnackbar({
        open: true,
        message:
          "There was an error updating the email template. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedOpening?.id) {
        console.error("No opening ID selected");
        navigate("/opening-details");
        return;
      }

      try {
        const openingResponse = await axios.get(
          `${BASE_API_URL}/opening/${selectedOpening.id}`,
        );
        setEmailBody(openingResponse.data[0].opening_task_email_format);
        setTaskOn(openingResponse.data[0].opening_task_enabled);
      } catch (error) {
        console.error("Error fetching applicant data:", error);
        setSnackbar({
          open: true,
          message: "Error loading data. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOpening, BASE_API_URL, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Email Configuration
      </Typography>

      <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        Email Format
      </Typography>

      <Typography
        variant="body1"
        paragraph
        sx={{ outline: "1px solid", outlineColor: "grey.500", padding: "10px" }}
      >
        Dear Candidate,
        <br />
        Congratulations on progressing to the next stage of our recruitment
        process. We're impressed with your application and look forward to
        learning more about you.
        <br />
        To move forward, please provide your availability for the next steps by
        clicking on the following link: Enter Availability. We kindly ask that
        you complete this within the next 3 business days.
        <br />
        If you have any questions about the process or require any
        accommodations, please don't hesitate to reach out.
        <br />
        We look forward to speaking with you soon.
        <br />
        Best regards,
        <br />
        Team Name
      </Typography>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h5">Task Details (Optional)</Typography>
        <FormControlLabel
          control={<Switch checked={taskOn} onChange={handleToggle} />}
          label="Task On?"
        />
      </div>
      <TextField
        label="Task Body"
        value={emailBody}
        onChange={(e) => {
          setEmailBody(e.target.value);
          validateEmailBody(e.target.value);
        }}
        onBlur={() => validateEmailBody(emailBody)}
        fullWidth
        multiline
        rows={4}
        sx={{ marginBottom: "20px" }}
        error={!!emailBodyError}
        helperText={emailBodyError}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <PermissionButton
          action="configure"
          subject="TaskEmail"
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          tooltipText="You do not have permission to configure the task email"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Confirm"}
        </PermissionButton>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleBack}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskEmailFormatPage;
