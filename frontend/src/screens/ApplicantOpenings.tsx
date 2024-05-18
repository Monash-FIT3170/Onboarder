import { useState, useEffect } from "react";
import { Typography, Button, Grid, TextField, MenuItem, Select } from "@mui/material";
import styled from "styled-components";
import BackIcon from "../assets/BackIcon";
import LoadingSpinner from "../components/LoadSpinner";
import { ApplicantOpeningsTable, openingsResultProps } from "../components/Applicant";
import axios from "axios";
import {
  SingleRoundTable,
  SingleRoundResultProps,
} from "../components/SingleRoundTable";
import { useNavigate } from "react-router-dom";

const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OpeningsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  top: 10px;
`;

function RecruitmentRoundDetailsPage() {
  const [rounds, setRounds] = useState<SingleRoundResultProps[]>([]);
  const [openings, setOpening] = useState<openingsResultProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [year, setYear] = useState("All");
  const [semester, setSemester] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roundsResponse = await axios.get(
          "http://127.0.0.1:3000/recruitmentRounds/1"
        );
        const openingsResponse = await axios.get(
          "http://127.0.0.1:3000/recruitmentRounds/1/openings"
        );
        setRounds(roundsResponse.data);
        setOpening(openingsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateStatus = async (statusChange: string) => {
    setIsUpdating(true);
    const data = {
      status: statusChange,
    };
    try {
      await axios.patch(
        `http://127.0.0.1:3000/recruitmentRounds/1/status`,
        data
      );
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error archiving round:", error);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleAddOpening = () => {
    navigate("/create-opening", {
      state: {
        deadline: rounds[0].deadline,
        roundId: rounds[0]?.id,
        round: rounds[0]?.student_team_name + " " + rounds[0]?.id,
      },
    });
  };

  return (
    <>
       <TitleWrapper>
          
          <Typography variant="h5">
            Student Team Openings
          </Typography>
        </TitleWrapper>
        
        <Grid container spacing={2} alignItems="center" justifyContent="center" marginTop="10px">
        <Grid item xs={3}>
          <TextField label="Search" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={3}>
          <TextField label="Filter by opening name" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={2}>
          <TextField label="Filter by student team" variant="outlined" fullWidth />
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
        <OpeningsWrapper>
          <Typography variant="h6">Recruitment Round Openings</Typography>
          <Button variant="contained" onClick={handleAddOpening}>
            {" "}
            Add Opening{" "}
          </Button>
        </OpeningsWrapper>
        <ApplicantOpeningsTable results={openings}></ApplicantOpeningsTable>
      </div>
    </>
  );
}

export default RecruitmentRoundDetailsPage;
