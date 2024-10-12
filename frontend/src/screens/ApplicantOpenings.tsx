import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  TextField,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import styled from "styled-components";
// import LoadingSpinner from "../components/LoadSpinner";
import {
  ApplicantOpeningsTable,
  applicantOpeningResultProps,
} from "../components/ApplicantOpeningsTable";
import axios from "axios";
import { getBaseAPIURL } from "../util/Util";
import { useNavigate } from "react-router-dom";
import BackIcon from "@mui/icons-material/ArrowBack";

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const generateSkeletonRows = () => {
  return Array.from(new Array(10)).map((_, index) => (
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
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="rectangular" height={30} />
      </TableCell>
    </TableRow>
  ));
};

function RecruitmentRoundDetailsPage() {
  const [openings, setOpenings] = useState<applicantOpeningResultProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [year] = useState("All");
  const [semester] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openingFilter] = useState("");
  const [teamFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const BASE_API_URL = getBaseAPIURL();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const openingsResponse = await axios.get(`${BASE_API_URL}/opening`);
        setOpenings(openingsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch openings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_API_URL]);

  const filteredOpenings = openings.filter((opening) => {
    if (openings.length !== 0) {
      const searchMatch =
        opening.opening_title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        opening.student_team_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const openingMatch = opening.opening_title
        .toLowerCase()
        .includes(openingFilter.toLowerCase());
      const teamMatch = opening.student_team_name
        .toLowerCase()
        .includes(teamFilter.toLowerCase());
      const semesterMatch =
        semester === "All" ||
        opening.recruitment_round_semester.toString() === semester;
      const yearMatch =
        year === "All" || opening.recruitment_round_year.toString() === year;
      const statusMatch = opening.opening_status === "A";

      return (
        searchMatch &&
        openingMatch &&
        teamMatch &&
        semesterMatch &&
        yearMatch &&
        statusMatch
      );
    }
    return false;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setSearchTerm(value);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      <TitleWrapper>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h5">Student Team Openings</Typography>
      </TitleWrapper>

      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        marginTop="10px"
      >
        <Grid item xs={3}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            inputProps={{ maxLength: 100 }}
            helperText={`${searchTerm.length}/100`}
          />
        </Grid>
        <Grid item xs={9}></Grid>
      </Grid>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
          marginTop: "30px",
        }}
      >
        {loading ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Opening Name</TableCell>
                  <TableCell>Application Deadline</TableCell>
                  <TableCell>Student Team</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{generateSkeletonRows()}</TableBody>
            </Table>
          </TableContainer>
        ) : filteredOpenings.length > 0 ? (
          <ApplicantOpeningsTable results={filteredOpenings} />
        ) : (
          <Typography variant="body1" align="center">
            No openings found matching your search criteria.
          </Typography>
        )}
      </div>
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

export default RecruitmentRoundDetailsPage;
