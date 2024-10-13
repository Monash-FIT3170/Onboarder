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
} from "@mui/material";
import styled from "styled-components";
// import LoadingSpinner from "../components/LoadSpinner";
import {
  OnboarderOpeningsTable,
  onboarderOpeningResultProps,
} from "../components/OnboarderOpeningsTable";
import axios from "axios";
import { getBaseAPIURL } from "../util/Util";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
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

function OnboarderOpeningsPage() {
  const [openings, setOpening] = useState<onboarderOpeningResultProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("All");
  const [semester, setSemester] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openingFilter, setOpeningFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const BASE_API_URL = getBaseAPIURL();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const openingsResponse = await axios.get(`${BASE_API_URL}/opening`);
        setOpening(openingsResponse.data);
        console.log(openingsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredOpenings = openings.filter((opening) => {
    // console.log(opening);
    if (openings.length != 0) {
      // filter active
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
      // Only show openings for active rounds
      const statusMatch = opening.opening_status === "A";
      // const statusMatch = true;

      return (
        searchMatch &&
        openingMatch &&
        teamMatch &&
        semesterMatch &&
        yearMatch &&
        statusMatch
      );
    }
  });

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
        spacing={1}
        alignItems="center"
        justifyContent="center"
        marginTop="8px"
      >
        <Grid item xs={3}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={9}></Grid>
      </Grid>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "8px",
          marginTop: "16px",
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
        ) : (
          <OnboarderOpeningsTable
            results={filteredOpenings}
          ></OnboarderOpeningsTable>
        )}
      </div>
    </>
  );
}

export default OnboarderOpeningsPage;
