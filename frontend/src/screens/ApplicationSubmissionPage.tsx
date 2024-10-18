import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  CircularProgress,
  Alert,
} from "@mui/material";
import BackIcon from "../assets/BackIcon";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useOpeningStore } from "../util/stores/openingApplicantStore";
import { getBaseAPIURL } from "../util/Util";

interface Opening {
  opening_title: string;
  opening_description: string;
}

interface Round {
  application_deadline: string;
  student_team_id: string;
  semester: string;
}

const SectionTitle = styled.div`
  margin-top: 30px;
`;

function ApplicationSubmissionPage() {
  const [opening, setOpening] = useState<Opening | null>(null);
  const [round, setRound] = useState<Round | null>(null);
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    additionalInfo: string;
    courseName: string;
    major: string;
    skills: string[];
    currentSemester: string;
    semesterRemaining: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    additionalInfo: "",
    courseName: "",
    major: "",
    skills: [],
    currentSemester: "",
    semesterRemaining: "",
  });
  const [errors, setErrors] = useState<
    Partial<
      Record<
        keyof typeof formData | "fetchOpening" | "fetchRound" | "submission",
        string
      >
    >
  >({});
  const BASE_API_URL = getBaseAPIURL();
  const [open, setOpen] = useState(false);
  const [dialogParam, setIsSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { round_id: roundId, opening_id: openingId } = useOpeningStore();

  useEffect(() => {
    const fetchData = async () => {
      if (roundId !== null && openingId !== null) {
        try {
          const openingRes = await axios.get(
            `${BASE_API_URL}/opening/${openingId}/`,
          );
          setOpening(openingRes.data);
        } catch (error) {
          console.error("Error fetching opening data:", error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            fetchOpening: "Failed to fetch opening data",
          }));
        }

        try {
          const roundRes = await axios.get(
            `${BASE_API_URL}/recruitment-round/${roundId}/`,
          );
          setRound(roundRes.data);
        } catch (error) {
          console.error("Error fetching round data:", error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            fetchRound: "Failed to fetch round data",
          }));
        }
      }
    };

    fetchData();
  }, [roundId, openingId, BASE_API_URL]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
    validateField(id as keyof typeof formData, value);
  };

  const validateField = (field: keyof typeof formData, value: string) => {
    let error = "";
    switch (field) {
      case "firstName":
      case "lastName":
        if (!value.trim()) error = "This field is required";
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Invalid email format";
        }
        break;
      case "phoneNumber":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^\+?[1-9]\d{1,14}$/.test(value)) {
          error = "Invalid phone number format";
        }
        break;
      case "courseName":
        if (!value.trim()) error = "Course name is required";
        break;
      case "currentSemester":
      case "semesterRemaining":
        if (!value.trim()) {
          error = "This field is required";
        } else if (isNaN(Number(value)) || Number(value) < 1) {
          error = "Must be a positive number";
        }
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      if (key !== "skills") {
        validateField(key, formData[key] as string);
      }
      if (errors[key as keyof typeof errors]) {
        newErrors[key] = errors[key as keyof typeof errors];
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const submissionData = {
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phoneNumber,
      email: formData.email,
      semesters_until_completion: formData.semesterRemaining,
      current_semester: formData.currentSemester,
      course_name: formData.courseName,
      major_enrolled: formData.major,
      additional_info: formData.additionalInfo,
      skills: formData.skills,
    };

    setIsSubmitting(true);

    try {
      await axios.post(
        `${BASE_API_URL}/opening/${openingId}/application`,
        submissionData,
      );
      setOpen(true);
      setIsSuccessful(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      setOpen(true);
      setIsSuccessful(false);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          submission: "You have already applied for this position.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          submission:
            "There was an error in lodging your application. Please try again later.",
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <IconButton onClick={() => navigate("/onboarder-openings")}>
        <BackIcon />
      </IconButton>
      <Typography variant="h4" component="div">
        {"Opening: " + opening?.opening_title}
      </Typography>
      <Typography variant="body1" component="div">
        Description: {opening?.opening_description}
      </Typography>

      {errors.fetchOpening && (
        <Alert severity="error">{errors.fetchOpening}</Alert>
      )}
      {errors.fetchRound && <Alert severity="error">{errors.fetchRound}</Alert>}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Application Deadline</TableCell>
              <TableCell align="center">Student Team</TableCell>
              <TableCell align="center">Semester</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                {round?.application_deadline
                  ? new Date(round.application_deadline).toLocaleString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : "N/A"}
              </TableCell>
              <TableCell align="center">
                {round?.student_team_id || "N/A"}
              </TableCell>
              <TableCell align="center">{round?.semester || "N/A"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <SectionTitle>
        <Typography variant="h5" color="inherit" component="div">
          Application Information
        </Typography>
      </SectionTitle>
      <Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="firstName"
            label="First Name*"
            variant="outlined"
            value={formData.firstName}
            onChange={handleInputChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            placeholder="e.g. Sarah"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="lastName"
            label="Last Name*"
            variant="outlined"
            value={formData.lastName}
            onChange={handleInputChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            placeholder="e.g. Jones"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="email"
            label="Email*"
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            placeholder="e.g. applicant628406@example.com"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="phoneNumber"
            label="Phone Number*"
            variant="outlined"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            placeholder="e.g. +1-294-300-6690"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="additionalInfo"
            label="Cover Letter"
            variant="outlined"
            multiline
            rows={4}
            value={formData.additionalInfo}
            onChange={handleInputChange}
            placeholder="Write your cover letter here..."
          />
        </Grid>
      </Grid>

      <Typography variant="h5" color="inherit" component="div">
        Course Information
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="courseName"
            label="Course Name*"
            variant="outlined"
            value={formData.courseName}
            onChange={handleInputChange}
            error={!!errors.courseName}
            helperText={errors.courseName}
            placeholder="e.g. Computer Science"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="major"
            label="Major"
            variant="outlined"
            value={formData.major}
            onChange={handleInputChange}
            placeholder="e.g. Data Science"
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            multiple
            freeSolo
            options={[]}
            value={formData.skills}
            onChange={(_, newValue: string[]) => {
              setFormData((prevData) => ({ ...prevData, skills: newValue }));
            }}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip {...getTagProps({ index })} key={option} label={option} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add skills"
                placeholder="Type and press Enter"
                helperText="Press Enter after typing each skill"
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="currentSemester"
            label="Current Semester"
            variant="outlined"
            value={formData.currentSemester}
            onChange={handleInputChange}
            error={!!errors.currentSemester}
            helperText={errors.currentSemester}
            placeholder="e.g. 5"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="semesterRemaining"
            label="Semesters Remaining"
            variant="outlined"
            value={formData.semesterRemaining}
            onChange={handleInputChange}
            error={!!errors.semesterRemaining}
            helperText={errors.semesterRemaining}
            placeholder="e.g. 3"
          />
        </Grid>
      </Grid>

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {dialogParam
            ? "Application Successful!"
            : "Application Submission Error"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogParam
              ? "Your application has been successfully lodged. We will get back to you soon."
              : errors.submission ||
                "There was an error in lodging your application. Please try again later!"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              if (dialogParam) {
                navigate("/onboarder-openings");
              }
            }}
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ApplicationSubmissionPage;
