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
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import LoadingSpinner from "../components/LoadSpinner";
import { useNavigate } from "react-router-dom";
import BackIcon from "../assets/BackIcon";

import { useApplicantStore } from "../util/stores/applicantStore";
import { getAppStatusText, getBaseAPIURL } from "../util/Util";
import PermissionButton from "../components/PermissionButton";

interface ResultProps {
  id: number;
  opening_id: number; // assuming application_deadline is a date in string format
  email: string;
  name: string;
  phone: string;
  semesters_until_completion: number;
  current_semester: number;
  major_enrolled: string;
  additional_info: string;
  skills: string[];
  status: string;
  created_at: number;
  course_name: string;
}

export default function RecruitmentPlatform() {
  const [applicantInformation, setApplicantInformation] =
    useState<ResultProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [dialogParam, setDialogParam] = useState("");
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const navigate = useNavigate();
  const [isDisabledAccept, setIsDisabledAccept] = useState(true);
  const [isDisabledReject, setIsDisabledReject] = useState(true);
  const BASE_API_URL = getBaseAPIURL();
  const [error, setError] = useState<string | null>(null);

  const selectedApplicant = useApplicantStore(
    (state) => state.selectedApplicant,
  );
  const clearSelectedApplicant = useApplicantStore(
    (state) => state.clearSelectedApplicant,
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedApplicant?.application_id) {
        setError("No application ID selected");
        navigate("/opening-details");
        return;
      }

      try {
        const applicantResponse = await axios.get(
          `${BASE_API_URL}/application/${selectedApplicant.application_id}`,
        );
        setApplicantInformation(applicantResponse.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            `Error fetching applicant data: ${error.response?.data.message || error.message}`,
          );
        } else {
          setError(
            "An unexpected error occurred while fetching applicant data",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedApplicant, navigate, BASE_API_URL]);

  useEffect(() => {
    if (applicantInformation) {
      const status = applicantInformation.status;
      if (status === "A") {
        setIsDisabledAccept(false);
        setIsDisabledReject(false);
      } else if (status === "C" || status === "X" || status === "R") {
        setIsDisabledAccept(true);
        setIsDisabledReject(true);
      } else {
        setError(`Invalid User Status: ${status}`);
      }
    }
  }, [applicantInformation]);

  const handleStatusUpdate = async (newStatus: "C" | "X") => {
    const action = newStatus === "C" ? "accepting" : "rejecting";
    const setLoading = newStatus === "C" ? setLoadingAccept : setLoadingReject;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.patch(
        `${BASE_API_URL}/application/${selectedApplicant?.application_id}/`,
        { status: newStatus },
      );

      if (response.status === 200) {
        setDialogParam(
          `Applicant ${newStatus === "C" ? "Accepted" : "Rejected"}!`,
        );
        setOpen(true);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          `Error ${action} the applicant: ${error.response?.data.message || error.message}`,
        );
      } else {
        setError(`An unexpected error occurred while ${action} the applicant`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (event: React.MouseEvent) => {
    event.preventDefault();
    handleStatusUpdate("C");
  };

  const handleReject = (event: React.MouseEvent) => {
    event.preventDefault();
    handleStatusUpdate("X");
  };

  const handleBack = () => {
    clearSelectedApplicant();
    navigate("/opening-details");
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!applicantInformation) {
    return (
      <Typography color="error">No applicant information available</Typography>
    );
  }

  return (
    <>
      <Typography
        variant="h5"
        component="div"
        sx={{ width: "50%", marginTop: "30px" }}
      >
        <IconButton onClick={handleBack}>
          <BackIcon />
        </IconButton>
        {selectedApplicant?.opening_name}
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Recruitment Round</TableCell>
              <TableCell>Application Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{selectedApplicant?.recruitment_round_name}</TableCell>
              <TableCell>
                {getAppStatusText(applicantInformation.status)}
              </TableCell>
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
        <Grid item xs={12}>
          <TextField
            id="name"
            label="Name"
            defaultValue={`${applicantInformation.name}`}
            fullWidth
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black",
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)", // Slightly dimmed label
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="email"
            label="Email"
            defaultValue={`${applicantInformation.email}`}
            disabled
            fullWidth
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black",
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)", // Slightly dimmed label
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="phone-number"
            label="Phone Number"
            defaultValue={`${applicantInformation.phone}`}
            disabled
            fullWidth
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black",
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)", // Slightly dimmed label
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="Additional-information"
            label="Additional Information"
            defaultValue={`${applicantInformation.additional_info}`}
            disabled
            fullWidth
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black",
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)", // Slightly dimmed label
              },
            }}
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
            id="Course-name"
            label="Course Name"
            defaultValue={`${applicantInformation.course_name}`}
            disabled
            fullWidth
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black",
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="Specialisation"
            label="Major"
            defaultValue={`${applicantInformation.major_enrolled}`}
            disabled
            fullWidth
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black",
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="Skills"
            label="Skills"
            defaultValue={`${applicantInformation.skills}`}
            disabled
            fullWidth
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black",
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)", // Slightly dimmed label
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="Semesters remaining"
            label="Semesters Remaining"
            defaultValue={`${applicantInformation.semesters_until_completion}`}
            disabled
            fullWidth
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black",
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)", // Slightly dimmed label
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="Current semester"
            label="Current Semester"
            defaultValue={`${applicantInformation.current_semester}`}
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black",
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)", // Slightly dimmed label
              },
            }}
          />
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "center", marginTop: "70px" }}
      >
        <PermissionButton
          action="update"
          subject="Opening"
          variant="contained"
          sx={{ m: 1 }}
          onClick={handleAccept}
          disabled={isDisabledAccept || loadingAccept}
          tooltipText="You do not have permission to accept this applicant"
        >
          {loadingAccept ? <CircularProgress size={24} /> : "ACCEPT APPLICANT"}
        </PermissionButton>
        <PermissionButton
          action="update"
          subject="Opening"
          variant="contained"
          color="error"
          sx={{ m: 1 }}
          onClick={handleReject}
          disabled={isDisabledReject}
          loading={loadingReject}
          tooltipText="You do not have permission to reject this applicant"
        >
          {loadingReject ? <CircularProgress size={24} /> : "REJECT APPLICANT"}
        </PermissionButton>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{dialogParam}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogParam}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBack}>CLOSE</Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
