import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  IconButton,
  Skeleton,
  TextField,
  Box,
  Collapse, // Importing Collapse to create expandable/collapsible sections
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Icon for expand action
import ExpandLessIcon from "@mui/icons-material/ExpandLess"; // Icon for collapse action
import BackIcon from "../assets/BackIcon";
import { useNavigate } from "react-router-dom";
import { getAppStatusText, getBaseAPIURL } from "../util/Util";
import axios from "axios";

import { useOpeningStore } from "../util/stores/openingStore";
import { useApplicantStore } from "../util/stores/applicantStore";
import { useAuthStore } from "../util/stores/authStore";
import React from "react";

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
  // States to manage sorting direction and column
  const [applications, setApplications] = useState<SingleApplicationProps[]>(
    [],
  ); // Storing applications data
  const [loading, setLoading] = useState(true); // Loading state
  const [expandedApplicants, setExpandedApplicants] = useState(true); // To handle expand/collapse for Applicants section
  const [expandedCandidates, setExpandedCandidates] = useState(false); // To handle expand/collapse for Candidates section
  const [expandedRecruits, setExpandedRecruits] = useState(false); // To handle expand/collapse for Recruits section

  const BASE_API_URL = getBaseAPIURL();
  const navigate = useNavigate();
  const selectedOpening = useOpeningStore((state) => state.selectedOpening);
  const clearSelectedOpening = useOpeningStore(
    (state) => state.clearSelectedOpening,
  );
  const setSelectedApplicant = useApplicantStore(
    (state) => state.setSelectedApplicant,
  );
  const authStore = useAuthStore();

  // Fetching applications data when the component mounts or selectedOpening changes
  useEffect(() => {
    if (!selectedOpening) {
      navigate("/viewrecruitmentround");
      return;
    }
    const fetchData = async () => {
      try {
        const applicationsResponse = await axios.get(
          `${BASE_API_URL}/opening/${selectedOpening.id}/application`,
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

  // const sortedApplications = React.useMemo(() => {
  //   if (!sortColumn) return applications;

  //   return [...applications].sort((a, b) => {
  //     if (a[sortColumn] < b[sortColumn]) {
  //       return sortDirection === "asc" ? -1 : 1;
  //     }
  //     if (a[sortColumn] > b[sortColumn]) {
  //       return sortDirection === "asc" ? 1 : -1;
  //     }
  //     return 0;
  //   });
  // }, [applications, sortColumn, sortDirection]);

  // Placeholder function for handling the sort
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

    navigate("/admin-acceptpage");
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

    navigate("/feedbacknote");
  };

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
      navigate("/viewrecruitmentround");
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

  const handleBack = () => {
    clearSelectedOpening();
    navigate("/recruitment-details-page");
  };

  const respond = () => {
    // clearSelectedOpening();
    navigate("/view-interview-allocation");
  };

  const respond2 = () => {
    // clearSelectedOpening();
    navigate("/task-email-format");
  };

  const handleSendEmails = async () => {
    setLoading(true);
    try {
      // const response = await axios.post(`${BASE_API_URL}/send-interview-emails/${selectedOpening.id}`); // Fixed but not tested
      // console.log(response);
      console.log("Commented out due to email limit");
    } catch (error) {
      console.error("Error sending emails:", error);
    }
    setLoading(false);
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
              console.log("Navigating to /task-email-format");
              respond2();
            }}
          >
            CONFIGURE INTERVIEW SCHEDULING EMAIL
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={() => {
              console.log("Navigating to /view-interview-allocation");
              respond();
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

      {/* adds a table showing the number of applications for the current opening */}
      <Typography
        variant="h6"
        style={{ marginLeft: "10px", marginTop: "20px" }}
      >
        Opening Applications
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <TextField
          style={{ width: "25%" }}
          variant="outlined"
          placeholder="Round Name, Deadline, etc..."
          size="small"
          label="Search"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSendEmails}
          disabled={
            loading ||
            applications.find((item) => item.status === "C") == undefined
          }
          style={{ marginLeft: "1rem" }}
        >
          {loading ? (
            <Skeleton width={100} />
          ) : (
            "Send Interview Scheduling Emails"
          )}
        </Button>
      </div>
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
    </div>
  );
}

export default ViewOpenPage;
