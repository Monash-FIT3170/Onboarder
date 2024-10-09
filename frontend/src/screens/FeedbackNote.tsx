import BackIcon from "../assets/BackIcon";
import { styled } from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Grid,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadSpinner";
import { useApplicantStore } from "../util/stores/applicantStore";
import { useState, useEffect } from "react";
import { useAuthStore } from "../util/stores/authStore";
import React from "react";
import { getBaseAPIURL } from "../util/Util";
import PermissionButton from "../components/PermissionButton";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface ResultProps {
  id: number;
  opening_id: number; // assuming application_deadline is a date in string format
  email: string;
  name: string;
  phone: string;
  semesters_until_completion: number;
  current_semester: number;
  course_enrolled: string;
  major_enrolled: string;
  additional_info: string;
  skills: string[];
  status: string;
  created_at: number;
  interview_date: string;
  profile_email: string;
  interview_notes: string;
  interview_score: number;
}

function Feedbacknote() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [openAccept, setOpenAccept] = React.useState(false);
  const [openReject, setOpenReject] = React.useState(false);
  const [isDisabledAccept, setIsDisabledAccept] = useState(true);
  const [isDisabledReject, setIsDisabledReject] = useState(true);
  const BASE_API_URL = getBaseAPIURL();

  const selectedApplicant = useApplicantStore(
    (state) => state.selectedApplicant,
  );
  const clearSelectedApplicant = useApplicantStore(
    (state) => state.clearSelectedApplicant,
  );
  const [applicantInformation, setApplicantInformation] = useState<
    ResultProps[]
  >([]);

  const APPLICATION_URL = `${BASE_API_URL}/application/${selectedApplicant?.application_id}`;

  const handleAccept = async () => {
    try {
      await axios.patch(APPLICATION_URL, {
        status: "R",
      });
    } catch (error) {
      console.error("There was an error!", error);
    }
    setOpenAccept(true);
  };
  const handleReject = async () => {
    try {
      await axios.patch(APPLICATION_URL, {
        status: "X",
      });
    } catch (error) {
      console.error("There was an error!", error);
    }
    setOpenReject(true);
  };
  const handleCloseAccept = () => {
    setOpenAccept(false);
    handleUpdate();
    navigate("/viewopen");
  };
  const handleCloseReject = () => {
    setOpenReject(false);
    handleUpdate();
    navigate("/viewopen");
  };
  const authStore = useAuthStore();

  const handleBack = () => {
    handleUpdate();
    clearSelectedApplicant();
    navigate("/viewopen");
  };

  const handleUpdate = () => {
    const submissionData = {
      interview_score: score,
      interview_notes: feedback,
    };

    axios
      .patch(
        `${BASE_API_URL}/application/${selectedApplicant?.application_id}`,
        submissionData,
      )
      .then((response) => {
        // console.log(response);
        // setOpen(true);
        // setIsSuccessful(true);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        // setOpen(true);
        // setIsSuccessful(false);
      })
      .finally(() => {
        // setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (applicantInformation.length > 0) {
      const status = applicantInformation[0]?.status;
      if (status === "C") {
        setIsDisabledAccept(false);
        setIsDisabledReject(false);
      } else if (status === "R" || status === "A" || status === "X") {
        setIsDisabledAccept(true);
        setIsDisabledReject(true);
      } else {
        console.log("Invalid User Status: ", status);
      }
    }
  }, [applicantInformation, openAccept, openReject]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedApplicant?.application_id) {
        console.error("No application ID selected");
        navigate("/viewopen");
        return;
      }
      try {
        const applicantResponse = await axios.get(
          `${BASE_API_URL}/application/${selectedApplicant?.application_id}`,
        );
        console.log(applicantResponse.data);
        setApplicantInformation(applicantResponse.data);
      } catch (error) {
        console.error("Error fetching applicant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedApplicant]);

  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Grid container spacing={4} justifyContent="left">
        <Grid item xs={12} md={6}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "20px 10px",
            }}
          >
            <IconButton onClick={() => handleBack()}>
              <BackIcon />
            </IconButton>
            <Typography variant="h5" style={{ marginLeft: "10px" }}>
              Note from Interview
            </Typography>
          </div>
        </Grid>
      </Grid>

      {/* Applicant Info in Table Format */}
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  Applicant Name
                </Typography>
              </TableCell>
              <TableCell>{applicantInformation[0]?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  Interviewer
                </Typography>
              </TableCell>
              <TableCell>
                {applicantInformation[0]?.profile_email ||
                  "Interviewer yet to be assigned"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  Student Team
                </Typography>
              </TableCell>
              <TableCell>{authStore.team_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  Date of Interview
                </Typography>
              </TableCell>
              <TableCell>
                {new Date(
                  applicantInformation[0]?.interview_date,
                ).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  Position
                </Typography>
              </TableCell>
              <TableCell>{selectedApplicant?.opening_name}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" fontSize={20} margin={1}>
        Score (Auto Saved)
      </Typography>
      <Grid justifyContent="left">
        <Grid item xs={12} md={6}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 3px",
            }}
          >
            <TextField
              id="outlined"
              label="Out of 10"
              variant="filled"
              defaultValue={applicantInformation[0]?.interview_score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>
        </Grid>
      </Grid>

      <Typography variant="body2" fontSize={20}>
        Interview Notes (Auto Saved)
      </Typography>
      <Grid container spacing={0} justifyContent="left">
        <Grid item xs={12}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 3px",
            }}
          >
            <TextField
              fullWidth
              label="Feedback note"
              defaultValue={applicantInformation[0]?.interview_notes}
              variant="filled"
              multiline
              rows={5}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </Grid>
      </Grid>

      <Grid
        item
        container
        xs={12}
        justifyContent="center"
        spacing={2}
        margin="20px 10px"
      >
        <Grid item>
          <React.Fragment>
            <PermissionButton
              action="update"
              subject="Opening"
              variant="contained"
              color="primary"
              disabled={isDisabledAccept || loading}
              onClick={handleAccept}
              tooltipText="You do not have permission to accept this candidate"
            >
              {loading ? <CircularProgress size={24} /> : "Accept Candidate"}
            </PermissionButton>
            <BootstrapDialog
              onClose={handleCloseAccept}
              aria-labelledby="customized-dialog-title"
              open={openAccept}
            >
              <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Candidate {`${applicantInformation[0]?.name}`} Accepted!
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  Candidate has been accepted as a Recruit for Monash Nova Rover
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleCloseAccept}>
                  Close
                </Button>
              </DialogActions>
            </BootstrapDialog>
          </React.Fragment>
        </Grid>

        <Grid item>
          <React.Fragment>
            <PermissionButton
              action="update"
              subject="Opening"
              variant="contained"
              color="warning"
              disabled={isDisabledReject || loading}
              onClick={handleReject}
              tooltipText="You do not have permission to reject this candidate"
            >
              {loading ? <CircularProgress size={24} /> : "Reject Candidate"}
            </PermissionButton>
            <BootstrapDialog
              onClose={handleCloseReject}
              aria-labelledby="customized-dialog-title"
              open={openReject}
            >
              <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Candidate {`${applicantInformation[0]?.name}`} Rejected!
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  Candidate has been rejected as a Recruit for Monash Nova Rover
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleCloseReject}>
                  Close
                </Button>
              </DialogActions>
            </BootstrapDialog>
          </React.Fragment>
        </Grid>
      </Grid>
    </>
  );
}

export default Feedbacknote;
