import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "../assets/BackIcon";
import LoadingSpinner from "../components/LoadSpinner";

import PermissionButton from "../components/PermissionButton";
import { useApplicantStore } from "../util/stores/applicantStore";
import { getAppStatusText, getBaseAPIURL } from "../util/Util";

interface ResultProps {
  id: number;
  opening_id: number; // assuming application_deadline is a date in string format
  email: string;
  name: string;
  phone: string;
  semesters_until_completion: number;
  current_semester: number;
  // course_enrolled: string;
  major_enrolled: string;
  additional_info: string;
  skills: string[];
  status: string;
  created_at: number;
  course_name: string;
}

export default function ReviewApplicantPage() {
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
  const BASE_API_URL = getBaseAPIURL();

  const selectedApplicant = useApplicantStore(
    (state) => state.selectedApplicant,
  );
  const clearSelectedApplicant = useApplicantStore(
    (state) => state.clearSelectedApplicant,
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedApplicant?.application_id) {
        console.error("No application ID selected");
        navigate("/opening-details");
        return;
      }

      try {
        const applicantResponse = await axios.get(
          `${BASE_API_URL}/application/${selectedApplicant?.application_id}`, // Working
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
    if (applicantInformation.length > 0) {
      const status = applicantInformation[0]?.status;
      // Allow accept/reject if status is "A" (Applicant), otherwise disable
      if (status === "A") {
        setIsDisabledAccept(false);
        setIsDisabledReject(false);
      } else if (status === "C" || status === "X" || status === "R") {
        setIsDisabledAccept(true);
        setIsDisabledReject(true);
      } else {
        console.log("Invalid User Status: ", status);
      }
    }
  }, [applicantInformation]);

  const handleAccept = async (event: any) => {
    event.preventDefault();
    setLoadingAccept(true);

    try {
      const submissionData = {
        status: "C",
      };
      const response = await axios.patch(
        `${BASE_API_URL}/application/${selectedApplicant?.application_id}/`, // Working
        submissionData,
      );
      if (response.status === 200) {
        // console.log(response);
        setDialogParam("Applicant Accepted!");
      } else {
        // console.log(response);
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
      const submissionData = {
        status: "X",
      };
      const response = await axios.patch(
        `${BASE_API_URL}/application/${selectedApplicant?.application_id}/`, // Working
        submissionData,
      );
      if (response.status === 200) {
        // console.log(response);
        setDialogParam("Applicant Rejected!");
      } else {
        // console.log(response);
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
    navigate("/opening-details");
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <Typography
        variant="h5"
        component="div"
        sx={{ width: "50%", marginTop: "0px" }}
      >
        {" "}
        <IconButton onClick={() => handleBack()}>
          <BackIcon />
        </IconButton>
        {"Opening: " + selectedApplicant?.opening_name}
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
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
                {getAppStatusText(applicantInformation[0]?.status)}
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
            defaultValue={`${applicantInformation[0]?.name}`}
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
            defaultValue={`${applicantInformation[0]?.email}`}
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
            defaultValue={`${applicantInformation[0]?.phone}`}
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
            defaultValue={`${applicantInformation[0]?.additional_info}`}
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
            defaultValue={`${applicantInformation[0]?.course_name}`}
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
            id="Specialisation"
            label="Major"
            defaultValue={`${applicantInformation[0]?.major_enrolled}`}
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
            id="Skills"
            label="Skills"
            defaultValue={`${applicantInformation[0]?.skills}`}
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
            defaultValue={`${applicantInformation[0]?.semesters_until_completion}`}
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
            defaultValue={`${applicantInformation[0]?.current_semester}`}
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
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
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
            <Button onClick={() => handleBack()}>CLOSE</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}
