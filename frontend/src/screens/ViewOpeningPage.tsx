import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackIcon from "../assets/BackIcon";
import { useApplicantStore } from "../util/stores/applicantStore";
import { useAuthStore } from "../util/stores/authStore";
import { useOpeningStore } from "../util/stores/openingStore";
import { getAppStatusText, getBaseAPIURL } from "../util/Util";
import PermissionButton from "../components/PermissionButton";
import Alert from "@mui/material/Alert";

export interface SingleApplicationProps {
  id: number;
  opening_id: number;
  email: string;
  name: string;
  phone: string;
  semesters_until_completion: number;
  current_semester: number;
  course_enrolled: string;
  major_enrolled: string;
  cover_letter: string;
  skills: string[];
  status: string;
  created_at: string;
}

function ViewOpenPage() {
  // State hooks
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState(null);
  const [applications, setApplications] = useState<SingleApplicationProps[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [confirmEmailModalOpen, setConfirmEmailModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Constants
  const BASE_API_URL = getBaseAPIURL();
  const navigate = useNavigate();
  const location = useLocation();

  // Store hooks
  const authStore = useAuthStore();
  const selectedOpening = useOpeningStore((state) => state.selectedOpening);
  const clearSelectedOpening = useOpeningStore(
    (state) => state.clearSelectedOpening,
  );
  const setSelectedApplicant = useApplicantStore(
    (state) => state.setSelectedApplicant,
  );

  // Derived state
  const sortedApplications = React.useMemo(() => {
    if (!sortColumn) return applications;

    return [...applications].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortColumn] > b[sortColumn]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [applications, sortColumn, sortDirection]);

  // Effect hooks
  useEffect(() => {
    if (!selectedOpening) {
      navigate("/view-recruitment-rounds");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const applicationsResponse = await axios.get(
          `${BASE_API_URL}/opening/${selectedOpening.id}/application`,
        );
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOpening, navigate, BASE_API_URL, location.key]);

  // Handler functions
  const handleSort = (column: any) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };

  const handleViewApplication = (applicationId: number) => {
    if (!selectedOpening) {
      setError("No opening selected. Please try again.");
      return;
    }

    setSelectedApplicant({
      opening_name: selectedOpening.title,
      recruitment_round_name: `${authStore.team_name} ${selectedOpening.recruitment_round_id}`,
      application_id: applicationId,
      opening_id: selectedOpening.id,
      recruitment_round_id: selectedOpening.recruitment_round_id,
      student_team_name: selectedOpening.student_team_name,
      opening_title: selectedOpening.title,
      application_count: selectedOpening.application_count,
    });

    navigate("/review-applicant");
  };

  const handleViewInterviewNotes = (applicationId: number) => {
    if (!selectedOpening) {
      setError("No opening selected. Please try again.");
      return;
    }

    setSelectedApplicant({
      opening_name: selectedOpening.title,
      recruitment_round_name: `${authStore.team_name} ${selectedOpening.recruitment_round_id}`,
      application_id: applicationId,
      opening_id: selectedOpening.id,
      recruitment_round_id: selectedOpening.recruitment_round_id,
      student_team_name: selectedOpening.student_team_name,
      opening_title: selectedOpening.title,
      application_count: selectedOpening.application_count,
    });

    navigate("/interview-feedback");
  };

  const handleBack = () => {
    clearSelectedOpening();
    navigate("/recruitment-round-details");
  };

  const handleInterviewScheduling = () => {
    navigate("/interview-scheduling");
  };

  const handleTaskEmailFormat = () => {
    navigate("/task-email-format");
  };

  const handleClickOpen = () => {
    setConfirmEmailModalOpen(true);
  };

  const handleClose = () => {
    setConfirmEmailModalOpen(false);
  };

  const handleSendEmails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_API_URL}/send-interview-emails/${selectedOpening?.id}`,
      );

      if (response.status === 200) {
        setSuccessMessage(
          response.data.message ||
            "Interview scheduling emails sent successfully.",
        );
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Failed to send interview scheduling emails. Please try again.",
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleConfirmSendEmails = () => {
    if (!selectedOpening) {
      setError("No opening selected. Please try again.");
      return;
    }
    handleClickOpen();
  };

  // Row generation function
  const generateRowFunction = (applications: SingleApplicationProps[]) => {
    return applications.map((application) => (
      <TableRow key={application.id}>
        <TableCell>{application.name}</TableCell>
        <TableCell>{application.email}</TableCell>
        <TableCell>{getAppStatusText(application.status)}</TableCell>
        <TableCell>
          {new Date(application.created_at).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {(application.status === "C" || application.status === "X") && (
              <Button
                variant="outlined"
                onClick={() => handleViewInterviewNotes(application.id)}
              >
                INTERVIEW NOTES
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="contained"
              onClick={() => handleViewApplication(application.id)}
            >
              VIEW APPLICATION
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <div
        style={{ display: "flex", alignItems: "center", margin: "20px 10px" }}
      >
        <IconButton onClick={handleBack}>
          <BackIcon />
        </IconButton>
        <Typography variant="h5" style={{ marginLeft: "10px" }}>
          {selectedOpening?.title || "No Opening Selected"}
        </Typography>

        <div style={{ marginLeft: "auto" }}>
          <Button variant="outlined" onClick={handleTaskEmailFormat}>
            CONFIGURE INTERVIEW SCHEDULING EMAIL
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={handleInterviewScheduling}
          >
            INTERVIEW SCHEDULE
          </Button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="recruitment round info">
          <TableHead>
            <TableRow>
              <TableCell>Recruitment Round</TableCell>
              <TableCell>Applications Received for Opening</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{`${authStore.team_name} ${selectedOpening?.recruitment_round_id || "N/A"}`}</TableCell>
              <TableCell>{selectedOpening?.application_count || 0}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: "50px" }}></div>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Opening Applications
        </Typography>
        <PermissionButton
          action="send"
          subject="Interview"
          variant="contained"
          onClick={handleConfirmSendEmails}
          disabled={
            loading || !applications.some((item) => item.status === "C")
          }
          style={{ marginLeft: "1rem" }}
          tooltipText="You do not have permission to send interview scheduling emails"
        >
          {loading ? (
            <Skeleton width={100} />
          ) : (
            "Send Interview Scheduling Emails"
          )}
        </PermissionButton>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="applications table">
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>
                Student Email
                <Button
                  onClick={() => handleSort("email")}
                  style={{
                    minWidth: "30px",
                    padding: "6px",
                    marginLeft: "5px",
                  }}
                >
                  {sortColumn === "email"
                    ? sortDirection === "asc"
                      ? "↓"
                      : "↑"
                    : "↓"}
                </Button>
              </TableCell>
              <TableCell>
                Status
                <Button
                  onClick={() => handleSort("status")}
                  style={{
                    minWidth: "30px",
                    padding: "6px",
                    marginLeft: "5px",
                  }}
                >
                  {sortColumn === "status"
                    ? sortDirection === "asc"
                      ? "↓"
                      : "↑"
                    : "↓"}
                </Button>
              </TableCell>
              <TableCell>
                Date of Submission
                <Button
                  onClick={() => handleSort("created_at")}
                  style={{
                    minWidth: "30px",
                    padding: "6px",
                    marginLeft: "5px",
                  }}
                >
                  {sortColumn === "created_at"
                    ? sortDirection === "asc"
                      ? "↓"
                      : "↑"
                    : "↓"}
                </Button>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? [...Array(3)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={80} height={30} />
                    </TableCell>
                  </TableRow>
                ))
              : generateRowFunction(sortedApplications)}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={confirmEmailModalOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Send Interview Scheduling Emails"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to send interview scheduling emails? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <PermissionButton
            action="send"
            subject="Interview"
            onClick={handleSendEmails}
            color="primary"
            autoFocus
            tooltipText="You do not have permission to send interview scheduling emails"
          >
            Confirm
          </PermissionButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error || !!successMessage}
        autoHideDuration={6000}
        onClose={() => {
          setError(null);
          setSuccessMessage(null);
        }}
      >
        <Alert
          onClose={() => {
            setError(null);
            setSuccessMessage(null);
          }}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ViewOpenPage;
