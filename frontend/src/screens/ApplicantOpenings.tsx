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
  ApplicantOpeningsTable,
  applicantOpeningResultProps,
} from "../components/ApplicantOpeningsTable";
import axios from "axios";
import { getBaseAPIURL } from "../util/Util";

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
  const [openings, setOpening] = useState<applicantOpeningResultProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("All");
  const [semester, setSemester] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openingFilter, setOpeningFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const BASE_API_URL = getBaseAPIURL();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const openingsResponse = await axios.get(`${BASE_API_URL}/opening`);
        setOpening(openingsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredOpenings = openings.filter((opening) => {
    console.log(opening);
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
                  <TableCell>Deadline</TableCell>
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
          <ApplicantOpeningsTable
            results={filteredOpenings}
          ></ApplicantOpeningsTable>
        )}
      </div>
    </>
  );
}

export default RecruitmentRoundDetailsPage;
