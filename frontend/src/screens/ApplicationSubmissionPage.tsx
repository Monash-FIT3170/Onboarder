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
} from "@mui/material";
import BackIcon from "../assets/BackIcon";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const SectionTitle = styled.div`
  margin-top: 30px;
`;

function ApplicationSubmissionPage() {
  const [studentTeam, setStudentTeam] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    coverLetter: "",
    courseName: "",
    major: "",
    skills: [],
    currentSemester: "",
    semesterRemaining: "",
  });
  const [open, setOpen] = useState(false);
  const [dialogParam, setIsSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    round_id: number;
    opening_id: number;
  };

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:3000/recruitmentRounds/${state.round_id}/openings/${state.opening_id}`
      )
      .then((res) => {
        setStudentTeam(res.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [state.round_id, state.opening_id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "courseName",
      "skills",
      "currentSemester",
      "semesterRemaining",
      "coverLetter",
    ];
    const isAnyFieldEmpty = requiredFields.some((field) => {
      if (Array.isArray(formData[field])) {
        return formData[field].length === 0;
      }
      return !formData[field];
    });

    if (isAnyFieldEmpty) {
      alert("Please fill in all required fields.");
    } else {
      const submissionData = {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phoneNumber,
        email: formData.email,
        semesters_until_completion: formData.semesterRemaining,
        current_semester: formData.currentSemester,
        course_enrolled: formData.courseName,
        major_enrolled: formData.major,
        cover_letter: formData.coverLetter,
        skills: formData.skills,
      };

      setIsSubmitting(true);

      axios
        .post(
          `http://127.0.0.1:3000/openings/${state.opening_id}/applications`,
          submissionData
        )
        .then((response) => {
          console.log(response);
          setOpen(true);
          setIsSuccessful(true);
        })
        .catch((error) => {
          console.error("There was an error!", error);
          setOpen(true);
          setIsSuccessful(false);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div>
      {studentTeam.map((row, index) => (
        <div key={index}>
          <Typography variant="h5" color="inherit" component="div">
            <IconButton onClick={() => navigate("/applicant-openings")}>
              <BackIcon />
            </IconButton>
            {row.title}
          </Typography>
          <Typography variant="body1" color="inherit" component="div">
            Description: {row.description}
          </Typography>
        </div>
      ))}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Deadline</TableCell>
              <TableCell align="center">Student Team</TableCell>
              <TableCell align="center">Semester</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentTeam.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(row.deadline).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell align="center">{row.student_team_name}</TableCell>
                <TableCell align="center">
                  Semester {row.recruitment_round_semester}
                </TableCell>
              </TableRow>
            ))}
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
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="lastName"
            label="Last Name*"
            variant="outlined"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="email"
            label="Email*"
            variant="outlined"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="phoneNumber"
            label="Phone Number*"
            variant="outlined"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="coverLetter"
            label="Cover Letter"
            variant="outlined"
            multiline
            rows={4}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="major"
            label="Major"
            variant="outlined"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            multiple
            freeSolo
            options={[]}
            value={formData.skills}
            onChange={(event, newValue) => {
              setFormData({ ...formData, skills: newValue });
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={index} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Add skills" />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="currentSemester"
            label="Current Semester"
            variant="outlined"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="semesterRemaining"
            label="Semesters Remaining"
            variant="outlined"
            onChange={handleInputChange}
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
            : "Error in Application Submission!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogParam
              ? "Your application has been successfully lodged. We will get back to you soon."
              : "There was an error in lodging your application. Please try again later!"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              navigate("/applicant-openings");
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
