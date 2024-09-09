import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  TextField,
  MenuItem,
  Select,
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
import { useAuthStore } from "../util/stores/authStore";

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
  // const [openings, setOpening] = useState<applicantOpeningResultProps[]>([]);
  const [openings, setOpening] = useState([
    {
      "id": 1,
      "recruitment_round_id": 101,
      "recruitment_round_year": 2024,
      "recruitment_round_semester": "1",
      "student_team_id": 1,
      "student_team_name": "Monash Nova Rover",
      "title": "Events Officer",
      "description": "Lead and manage event planning for the team.",
      "status": "Open",
      "required_skills": ["Communication", "Leadership"],
      "desired_skills": ["Project Management"],
      "application_count": 20,
      "applications_pending_review": 5,
      "deadline": "2024-04-20"
    }
  ])
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("All");
  const [semester, setSemester] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const openingsResponse = await axios.get(
          "http://127.0.0.1:3000/openings"
        );
        setOpening(openingsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <TextField label="Search" variant="outlined" fullWidth />
        </Grid>

        <Grid item xs={3}>
          <TextField
            label="Filter by opening name"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Filter by student team"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <Select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={2}>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
            <MenuItem value="2026">2026</MenuItem>
            <MenuItem value="2027">2027</MenuItem>
          </Select>
        </Grid>
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
          <ApplicantOpeningsTable results={openings}></ApplicantOpeningsTable>
        )}
      </div>
    </>
  );
}

export default RecruitmentRoundDetailsPage;
