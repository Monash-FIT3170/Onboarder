import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import LoadingSpinner from "../components/LoadSpinner";
import { useNavigate } from "react-router-dom";
import BackIcon from "../assets/BackIcon";

import { useApplicantStore } from "../util/stores/applicantStore";

interface ResultProps {
  id: number;
  opening_id: number; // assuming deadline is a date in string format
  email: string;
  name: string;
  phone: string;
  semesters_until_completion: number;
  current_semester: number;
  course_enrolled: string;
  major_enrolled: string;
  cover_letter: string;
  skills: string[];
  accepted: string;
  created_at: number;
}

export default function RecruitmentPlatform() {
  const [applicantInformation, setApplicantInformation] = useState<
    ResultProps[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [dialogParam, setDialogParam] = useState("");
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const navigate = useNavigate();
  const [isDisabledAccept, setIsDisabledAccept] = useState(true);
  const [isDisabledReject, setIsDisabledReject] = useState(true);

  const selectedApplicant = useApplicantStore(state => state.selectedApplicant);
  const clearSelectedApplicant = useApplicantStore(state => state.clearSelectedApplicant);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedApplicant?.application_id) {
        console.error("No application ID selected");
        navigate("/viewopen"); 
        return;
      }
  
      try {
        const applicantResponse = await axios.get(
          `http://127.0.0.1:3000/applications/${selectedApplicant?.application_id}`
        );
        setApplicantInformation(applicantResponse.data);
      } catch (error) {
        console.error("Error fetching applicant data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [selectedApplicant]);

  useEffect(() => {
    if (applicantInformation[0]?.accepted === "U") {
      setIsDisabledAccept(false);
      setIsDisabledReject(false);
    } else if (applicantInformation[0]?.accepted === "A") {
      setIsDisabledReject(false);
    } else if (applicantInformation[0]?.accepted === "R") {
      setIsDisabledAccept(false);
    } else {
      console.log("Invalid User Status");
    }
  }, [applicantInformation]);

  const handleAccept = async (event: any) => {
    event.preventDefault();
    setLoadingAccept(true);

    try {
      const response = await axios.post(
        `http://127.0.0.1:3000/applications/${selectedApplicant?.application_id}/accept`
      );
      if (response.status === 201) {
        console.log(response);
        setDialogParam("Applicant Accepted!");
      } else {
        console.log(response);
        setDialogParam("There was an error accepting the applicant.");
      }
    } catch (error) {
      console.error("There was an error!", error);
      setDialogParam("There was an error accepting the applicant.");
    } finally {
      setOpen(true);
      setLoadingAccept(false);
    }

    clearSelectedApplicant();
  };

  const handleReject = async (event: any) => {
    event.preventDefault();
    setLoadingReject(true);

    try {
      const response = await axios.post(
        `http://127.0.0.1:3000/applications/${selectedApplicant?.application_id}/reject`
      );
      if (response.status === 201) {
        console.log(response);
        setDialogParam("Applicant Rejected!");
      } else {
        console.log(response);
        setDialogParam("There was an error rejecting the applicant.");
      }
    } catch (error) {
      console.error("There was an error!", error);
      setDialogParam("There was an error rejecting the applicant.");
    } finally {
      setOpen(true);
      setLoadingReject(false);
    }
  };

  const handleBack = () => {
    clearSelectedApplicant();
    navigate("/viewopen");
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <Typography
        variant="h5"
        component="div"
        sx={{ width: "50%", marginTop: "30px" }}
      >
        {" "}
        <IconButton onClick={() => handleBack()}>
          <BackIcon />
        </IconButton>
        {selectedApplicant?.opening_name}
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Recruitment Round</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{selectedApplicant?.recruitment_round_name}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Grid item xs={12}>
        <Typography
          variant="h5"
          component="div"
          sx={{ marginLeft: "10px", marginBottom: "20px", marginTop: "20px" }}
        >
          Applicant Info
        </Typography>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <TextField
            disabled={true}
            required
            id="first-name"
            label="First Name"
            defaultValue={`${applicantInformation[0]?.name}`}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="last-name"
            label="Last Name"
            defaultValue={`${applicantInformation[0]?.name}`}
            fullWidth
            disabled={true}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="email"
            label="Email"
            defaultValue={`${applicantInformation[0]?.email}`}
            disabled={true}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="phone-number"
            label="Phone Number"
            defaultValue={`${applicantInformation[0]?.phone}`}
            disabled={true}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="Additional-information"
            label="Additional Information"
            defaultValue={`${applicantInformation[0]?.cover_letter}`}
            disabled={true}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="h5"
          component="div"
          sx={{ marginLeft: "10px", marginBottom: "20px", marginTop: "20px" }}
        >
          Course Info
        </Typography>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <TextField
            required
            id="Course-name"
            label="Course Name"
            defaultValue={`${applicantInformation[0]?.course_enrolled}`}
            disabled={true}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="Specialisation"
            label="Major"
            defaultValue={`${applicantInformation[0]?.major_enrolled}`}
            disabled={true}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="Skills"
            label="Skills"
            defaultValue={`${applicantInformation[0]?.skills}`}
            disabled={true}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="Semesters remaining"
            label="Semesters Remaining"
            defaultValue={`${applicantInformation[0]?.semesters_until_completion}`}
            disabled={true}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            id="Current semester"
            label="Current Semester"
            defaultValue={`${applicantInformation[0]?.current_semester}`}
            disabled={true}
          />
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "center", marginTop: "70px" }}
      >
        <Button
          variant="contained"
          sx={{ m: 1, backgroundColor: "#1f8ae7" }}
          onClick={handleAccept}
          disabled={isDisabledAccept || loadingAccept}
        >
          {loadingAccept ? <CircularProgress size={24} /> : "ACCEPT"}
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ m: 1 }}
          onClick={handleReject}
          disabled={isDisabledReject || loadingReject}
        >
          {loadingReject ? <CircularProgress size={24} /> : "REJECT"}
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{dialogParam}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogParam}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleBack()}
            >
              CLOSE
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}
