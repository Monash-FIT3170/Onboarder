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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EmailConfigModal from "../components/EmailConfigModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import BackIcon from "../assets/BackIcon";
import { useApplicantStore } from "../util/stores/applicantStore";
import { useAuthStore } from "../util/stores/authStore";
import { useOpeningStore } from "../util/stores/openingStore";
import { getAppStatusText, getBaseAPIURL } from "../util/Util";
import PermissionButton from "../components/PermissionButton";

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

function OpeningDetailsPage() {
  // State hooks
  const [applications, setApplications] = useState<SingleApplicationProps[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [expandedApplicants, setExpandedApplicants] = useState(false);
  const [expandedCandidates, setExpandedCandidates] = useState(false);
  const [expandedRecruits, setExpandedRecruits] = useState(false);
  const [confirmEmailModalOpen, setConfirmEmailModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEmailConfigModalOpen, setIsEmailConfigModalOpen] = useState(false);
  // Constants
  const BASE_API_URL = getBaseAPIURL();
  const navigate = useNavigate();

  // Store hooks
  const authStore = useAuthStore();
  const selectedOpening = useOpeningStore((state) => state.selectedOpening);
  const setSelectedApplicant = useApplicantStore(
    (state) => state.setSelectedApplicant,
  );

  const clearSelectedOpening = useOpeningStore(
    (state) => state.clearSelectedOpening,
  );
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
  }, [selectedOpening, navigate, BASE_API_URL]);

  const handleViewApplication = (applicationId: number) => {
    setSelectedApplicant({
      opening_name: selectedOpening?.title ?? null,
      recruitment_round_name: `${authStore.team_name} ${selectedOpening?.recruitment_round_id}`,
      application_id: applicationId,
      opening_id: selectedOpening?.id ?? null,
      recruitment_round_id: selectedOpening?.recruitment_round_id ?? null,
      student_team_name: selectedOpening?.student_team_name ?? null,
      opening_title: selectedOpening?.title ?? null,
      application_count: selectedOpening?.application_count ?? null,
    });

    navigate("/review-applicant");
  };

  const handleViewInterviewNotes = (applicationId: number) => {
    setSelectedApplicant({
      opening_name: selectedOpening?.title ?? null,
      recruitment_round_name: `${authStore.team_name} ${selectedOpening?.recruitment_round_id}`,
      application_id: applicationId,
      opening_id: selectedOpening?.id ?? null,
      recruitment_round_id: selectedOpening?.recruitment_round_id ?? null,
      student_team_name: selectedOpening?.student_team_name ?? null,
      opening_title: selectedOpening?.title ?? null,
      application_count: selectedOpening?.application_count ?? null,
    });

    navigate("/interview-feedback");
  };

  const handleBack = () => {
    clearSelectedOpening();
    navigate("/recruitment-round-details");
  };

  const respond = () => {
    // clearSelectedOpening();
    navigate("/interview-scheduling");
  };

  const handleOpenEmailConfigModal = () => {
    setIsEmailConfigModalOpen(true);
  };

  const handleCloseEmailConfigModal = () => {
    setIsEmailConfigModalOpen(false);
  };

  const handleClickOpen = () => {
    setConfirmEmailModalOpen(true);
  };

  const handleClose = () => {
    setConfirmEmailModalOpen(false);
  };

  const handleSendEmails = async () => {
    if (!selectedOpening) {
      setError("No opening selected. Please try again.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${BASE_API_URL}/send-interview-emails/${selectedOpening.id}`,
      );
      setSuccessMessage("Interview scheduling emails sent successfully.");
    } catch (error) {
      console.error("Error sending emails:", error);
      setError("Failed to send interview scheduling emails. Please try again.");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleConfirmSendEmails = () => {
    handleClickOpen();
  };

  const filterApplications = (status: string) =>
    applications.filter(
      (app) => app.status.toLowerCase() === status.toLowerCase(),
    );

  const generateRowFunction = (applications: SingleApplicationProps[]) => {
    if (applications.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="left" sx={{ width: "20%" }}>
            None
          </TableCell>
        </TableRow>
      );
    }

    return applications.map((application) => (
      <TableRow key={application.id}>
        <TableCell sx={{ width: "20%" }}>{application.name}</TableCell>
        <TableCell sx={{ width: "20%" }}>{application.email}</TableCell>
        <TableCell sx={{ width: "10%" }}>
          {getAppStatusText(application.status)}
        </TableCell>
        <TableCell sx={{ width: "15%" }}>
          {new Date(application.created_at).toLocaleDateString()}
        </TableCell>
        <TableCell sx={{ width: "35%" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            {/* If the application is in the "C" (Candidate) or "R" (Recruit) status, show the INTERVIEW NOTES button */}
            {(application.status === "C" || application.status === "R") && (
              <Button
                variant="outlined"
                onClick={() => handleViewInterviewNotes(application.id)}
              >
                INTERVIEW NOTES
              </Button>
            )}
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

  const renderCategorySection = (
    title: string,
    status: string,
    expanded: boolean,
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
    tooltipText: string,
  ) => {
    const filteredApplications = filterApplications(status);

    return (
      <Box sx={{ mt: 2 }}>
        <Button
          onClick={() => setExpanded(!expanded)}
          fullWidth
          sx={{
            justifyContent: "flex-start",
            // color: "primary.main",
            // "&:hover": {
            //   backgroundColor: "rgba(0, 0, 0, 0.04)",
            // },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={tooltipText}>
              <IconButton size="small" sx={{ mr: 1 }}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h6"
              component="div"
              // sx={{ fontWeight: "bold" }}
            >
              {title + " (" + filteredApplications.length + ")"}
            </Typography>
          </Box>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <TableContainer component={Paper}>
            <Table>
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
                          <Skeleton
                            variant="rectangular"
                            width={200}
                            height={36}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : generateRowFunction(filteredApplications)}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>
    );
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div>
      {/* Creates a button below allowing the user to add positions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "0px 0px 8px",
        }}
      >
        <IconButton onClick={() => handleBack()}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" style={{ marginLeft: "10px" }}>
          {"Opening: " + selectedOpening?.title}
        </Typography>

        <div style={{ marginLeft: "auto" }}>
          <Button variant="outlined" onClick={handleOpenEmailConfigModal}>
            CONFIGURE INTERVIEW SCHEDULING EMAIL
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={() => {
              respond();
            }}
          >
            INTERVIEW SCHEDULE
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Recruitment Round</TableCell>
              <TableCell>Applications Received for Opening</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{`${authStore.team_name} ${selectedOpening?.recruitment_round_id}`}</TableCell>
              <TableCell>{selectedOpening?.application_count}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h5" component="div">
          Opening Applications
        </Typography>

        <Tooltip
          title={
            applications.find((item) => item.status === "C") == undefined
              ? "There are no candidates to send interview scheduling emails to. Accept applications to send emails."
              : ""
          }
          arrow
        >
          <span>
            <PermissionButton
              action="send"
              subject="Interview"
              variant="contained"
              onClick={handleConfirmSendEmails}
              disabled={
                loading ||
                applications.find((item) => item.status === "C") == undefined
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
          </span>
        </Tooltip>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "20%" }}>Student Name</TableCell>
              <TableCell sx={{ width: "20%" }}>Student Email</TableCell>
              <TableCell sx={{ width: "10%" }}>Status</TableCell>
              <TableCell sx={{ width: "15%" }}>Date of Submission</TableCell>
              <TableCell sx={{ width: "35%" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
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

      {renderCategorySection(
        "Applicants",
        "A",
        expandedApplicants,
        setExpandedApplicants,
        "Applicants are students who have submitted an application.",
      )}
      {renderCategorySection(
        "Candidates",
        "C",
        expandedCandidates,
        setExpandedCandidates,
        "Candidates have had their application accepted, and have made it to the interview stage.",
      )}
      {renderCategorySection(
        "Recruits",
        "R",
        expandedRecruits,
        setExpandedRecruits,
        "Recruits have completed their interview and were accepted to be a part of the team.",
      )}

      <EmailConfigModal
        open={isEmailConfigModalOpen}
        onClose={handleCloseEmailConfigModal}
        setEmailBodyNew={null}
        setTaskOnNew={null}
        newOpening={false}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default OpeningDetailsPage;
