import React, { useState, useEffect } from "react";
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
        console.log("Fetched applications:", applicationsResponse.data); // Debugging
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const filterApplications = (status: string) =>
    applications.filter(
      (app) => app.status.toLowerCase() === status.toLowerCase(),
    );

  // Function to generate table rows based on applications list
  const generateRowFunction = (applications: SingleApplicationProps[]) => {
    // If there are no applications, display a message saying no data is available.
    if (applications.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center">
            No data available for this category.
          </TableCell>
        </TableRow>
      );
    }

    // Map through the applications array and create a table row for each application
    return applications.map((application) => (
      <TableRow key={application.id}>
        {/* Student Name */}
        <TableCell>{application.name}</TableCell>

        {/* Student Email */}
        <TableCell>{application.email}</TableCell>

        {/* Application Status */}
        <TableCell>{getAppStatusText(application.status)}</TableCell>

        {/* Date of Submission */}
        <TableCell>
          {new Date(application.created_at).toLocaleDateString()}
        </TableCell>

        {/* Actions: View application and interview notes if applicable */}
        <TableCell>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            {/* Show interview notes button only for Candidate or Recruit */}
            {(application.status === "Candidate" ||
              application.status === "Recruit") && (
              <Button
                variant="outlined"
                onClick={() => handleViewInterviewNotes(application.id)}
              >
                INTERVIEW NOTES
              </Button>
            )}

            {/* View application button */}
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

  // Render section for Applicants, Candidates, or Recruits
  const renderCategorySection = (
    title: string,
    status: string,
    expanded: boolean,
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const filteredApplications = filterApplications(status);
    console.log(status);
    console.log(filteredApplications);

    return (
      <Box sx={{ mb: 2 }}>
        <Button
          onClick={() => setExpanded(!expanded)}
          fullWidth
          sx={{
            justifyContent: "space-between",
            mb: 1,
            color: "primary.main",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Student Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date of Submission</TableCell>
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
}

export default ViewOpenPage;
