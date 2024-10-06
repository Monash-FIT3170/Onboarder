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
  Box,
  Collapse,
} from "@mui/material";
import BackIcon from "../assets/BackIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
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
  const BASE_API_URL = getBaseAPIURL();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<SingleApplicationProps[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  // Collapsible states for each group
  const [expandedApplicants, setExpandedApplicants] = useState(false);
  const [expandedCandidates, setExpandedCandidates] = useState(false);
  const [expandedRecruits, setExpandedRecruits] = useState(false);

  const selectedOpening = useOpeningStore((state) => state.selectedOpening);
  const clearSelectedOpening = useOpeningStore(
    (state) => state.clearSelectedOpening,
  );
  const setSelectedApplicant = useApplicantStore(
    (state) => state.setSelectedApplicant,
  );
  const authStore = useAuthStore();

  // Fetch applications data
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

  // Handle viewing the application
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

  // Filter applications by status (Applicant, Candidate, Recruit)
  const filterApplications = (status: string) =>
    applications.filter(
      (app) => app.status.toLowerCase() === status.toLowerCase(),
    );

  // Function to generate table rows based on applications list
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
          <Button
            variant="contained"
            onClick={() => handleViewApplication(application.id)}
          >
            VIEW APPLICATION
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      {/* Back Button and Page Title */}
      <div
        style={{ display: "flex", alignItems: "center", margin: "20px 10px" }}
      >
        <IconButton onClick={() => navigate("/recruitment-details-page")}>
          <BackIcon />
        </IconButton>
        <Typography variant="h5" style={{ marginLeft: "10px" }}>
          {selectedOpening?.title}
        </Typography>
      </div>

      {/* Recruitment Round Details */}
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

      {/* "Opening Applications" heading and "Send Emails" Button */}
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
        <Button
          variant="contained"
          onClick={() => {
            console.log("Sending Interview Scheduling Emails");
            // Add your email logic here
          }}
        >
          Send Interview Scheduling Emails
        </Button>
      </div>

      {/* Common table header for all sections */}
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Student Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date of Submission</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      {/* Applicants Section */}
      <Box>
        <Button
          onClick={() => setExpandedApplicants(!expandedApplicants)}
          fullWidth
          style={{ justifyContent: "space-between" }}
        >
          <Typography variant="h6">Applicants</Typography>
          {expandedApplicants ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
        <Collapse in={expandedApplicants} timeout="auto" unmountOnExit>
          <TableContainer component={Paper}>
            <Table aria-label="applicants table">
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
                            width={80}
                            height={30}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : generateRowFunction(filterApplications("applicant"))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>

      {/* Candidates Section */}
      <Box>
        <Button
          onClick={() => setExpandedCandidates(!expandedCandidates)}
          fullWidth
          style={{ justifyContent: "space-between" }}
        >
          <Typography variant="h6">Candidates</Typography>
          {expandedCandidates ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
        <Collapse in={expandedCandidates} timeout="auto" unmountOnExit>
          <TableContainer component={Paper}>
            <Table aria-label="candidates table">
              <TableBody>
                {generateRowFunction(filterApplications("candidate"))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>

      {/* Recruits Section */}
      <Box>
        <Button
          onClick={() => setExpandedRecruits(!expandedRecruits)}
          fullWidth
          style={{ justifyContent: "space-between" }}
        >
          <Typography variant="h6">Recruits</Typography>
          {expandedRecruits ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
        <Collapse in={expandedRecruits} timeout="auto" unmountOnExit>
          <TableContainer component={Paper}>
            <Table aria-label="recruits table">
              <TableBody>
                {generateRowFunction(filterApplications("recruit"))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>
    </div>
  );
}

export default ViewOpenPage;
