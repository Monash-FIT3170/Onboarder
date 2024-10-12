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
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState(null);
  const [applications, setApplications] = useState<SingleApplicationProps[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmEmailModalOpen, setConfirmEmailModalOpen] = useState(false);

  // Constants
  const BASE_API_URL = getBaseAPIURL();
  const navigate = useNavigate();

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
        const applicationsResponse = await axios.get(
          `${BASE_API_URL}/opening/${selectedOpening.id}/application`, // Working
        );
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOpening, navigate]);

  // Handler functions
  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };

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

  const respond2 = () => {
    // clearSelectedOpening();
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
        `${BASE_API_URL}/send-interview-emails/${selectedOpening.id}`,
      );
      // console.log(response);
    } catch (error) {
      console.error("Error sending emails:", error);
    }
    setLoading(false);
    handleClose();
  };

  const handleConfirmSendEmails = () => {
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
            {(application.status == "C" || application.status == "X") && (
              <Button
                variant="outlined"
                onClick={() => handleViewInterviewNotes(application.id)}
              >
                INTERVIEW NOTES
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />{" "}
            {/* Spacer to push the VIEW button to the right */}
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

  useEffect(() => {
    if (!selectedOpening) {
      navigate("/view-recruitment-round");
      return;
    }

    const fetchData = async () => {
      try {
        const applicationsResponse = await axios.get(
          `${BASE_API_URL}/opening/${selectedOpening.id}/application`, // Working
        );
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOpening, navigate]);

  const handleInterviewSchedule = () => {
    navigate("/interview-scheduling");
  };

  return (
    <div>
      {/* Creates a button below allowing the user to add positions */}
      <div
        style={{ display: "flex", alignItems: "center", margin: "20px 10px" }}
      >
        <IconButton onClick={() => handleBack()}>
          <BackIcon />
        </IconButton>
        <Typography variant="h5" style={{ marginLeft: "10px" }}>
          {selectedOpening?.title}
        </Typography>

        <div style={{ marginLeft: "auto" }}>
          <Button
            variant="outlined"
            onClick={() => {
              // console.log("Navigating to /task-email-format");
              respond2();
            }}
          >
            CONFIGURE INTERVIEW SCHEDULING EMAIL
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={() => {
              // console.log("Navigating to /interview-scheduling");
              handleInterviewSchedule();
            }}
          >
            INTERVIEW SCHEDULE
          </Button>
        </div>
      </div>

      {/* creates a table showing all the number of applications for each recruitment round */}
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
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
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
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
                  onClick={() => handleSort("date")}
                  style={{
                    minWidth: "30px",
                    padding: "6px",
                    marginLeft: "5px",
                  }}
                >
                  {sortColumn === "date"
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
    </div>
  );
}

export default OpeningDetailsPage;
