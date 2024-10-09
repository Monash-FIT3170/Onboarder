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
import { useNavigate } from "react-router-dom";
import { useOpeningStore } from "../util/stores/openingApplicantStore";
import { getBaseAPIURL } from "../util/Util";

const SectionTitle = styled.div`
  margin-top: 30px;
`;

function ApplicationSubmissionPage() {
  const [opening, setOpening] = useState([]);
  const [round, setRound] = useState([]);
  const [formData, setFormData] = useState({
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
  const BASE_API_URL = getBaseAPIURL();
  const [open, setOpen] = useState(false);
  const [dialogParam, setIsSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { round_id: roundId, opening_id: openingId } = useOpeningStore();

  useEffect(() => {
    if (roundId !== null && openingId !== null) {
      axios
        .get(
          `${BASE_API_URL}/opening/${openingId}/`, // Working
        )
        .then((res) => {
          // console.log(res.data);
          setOpening(res.data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
      axios
        .get(
          `${BASE_API_URL}/recruitment-round/${roundId}/`, // Working
        )
        .then((res) => {
          // console.log(res.data);
          setRound(res.data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  }, [roundId, openingId]);

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
      "additionalInfo",
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
        course_name: formData.courseName,
        major_enrolled: formData.major,
        additional_info: formData.additionalInfo,
        skills: formData.skills,
      };

      setIsSubmitting(true);

      axios
        .post(
          `${BASE_API_URL}/opening/${openingId}/application`, // Working
          submissionData,
        )
        .then((response) => {
          // console.log(response);
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
      <IconButton onClick={() => navigate("/onboarder-openings")}>
        <BackIcon />
      </IconButton>
      <Typography variant="h5" component="div">
        {opening[0]?.opening_title}
      </Typography>
      <Typography variant="body1" component="div">
        Description: {opening[0]?.opening_description}
      </Typography>

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
                {new Date(round[0]?.application_deadline).toLocaleString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </TableCell>
              <TableCell align="center">{round[0]?.student_team_id}</TableCell>
              <TableCell align="center">{round[0]?.semester}</TableCell>
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
            onChange={handleInputChange}
            placeholder="e.g. Sarah"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="lastName"
            label="Last Name*"
            variant="outlined"
            onChange={handleInputChange}
            placeholder="e.g. Jones"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="email"
            label="Email*"
            variant="outlined"
            onChange={handleInputChange}
            placeholder="e.g. applicant628406@example.com"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="phoneNumber"
            label="Phone Number*"
            variant="outlined"
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            placeholder="e.g. Computer Science"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="major"
            label="Major"
            variant="outlined"
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
            onChange={(event, newValue) => {
              setFormData({ ...formData, skills: newValue });
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={index} label={option} {...getTagProps({ index })} />
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
            onChange={handleInputChange}
            placeholder="e.g. 5"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="semesterRemaining"
            label="Semesters Remaining"
            variant="outlined"
            onChange={handleInputChange}
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
              navigate("/onboarder-openings");
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
