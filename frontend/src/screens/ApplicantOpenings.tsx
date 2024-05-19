import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import styled from "styled-components";
import LoadingSpinner from "../components/LoadSpinner";
import {
  ApplicantOpeningsTable,
  applicantOpeningResultProps,
} from "../components/Applicant";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

function RecruitmentRoundDetailsPage() {
  const [openings, setOpening] = useState<applicantOpeningResultProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("All");
  const [semester, setSemester] = useState("All");
  const navigate = useNavigate();

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

  if (loading) {
    return <LoadingSpinner />;
  }

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
        <ApplicantOpeningsTable results={openings}></ApplicantOpeningsTable>
      </div>
    </>
  );
}

export default RecruitmentRoundDetailsPage;
