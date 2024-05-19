import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button
} from "@mui/material";
import styled from "styled-components";
import LoadingSpinner from "../components/LoadSpinner";
import {
  AdminOpeningsTable,
  adminOpeningResultProps,
} from "../components/adminpage";
import {
  ArchiveAdminOpeningsTable,
  archiveOpeningResultProps,
} from "../components/archivedadmin";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

function RecruitmentRoundDetailsPage() {
  const [openings, setOpening] = useState<adminOpeningResultProps[]>([]);
  const [archiveOpenings, setArchiveOpening] = useState<archiveOpeningResultProps[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        const archiveOpeningsResponse = await axios.get(
          "http://127.0.0.1:3000/archive-openings"
        );
        setArchiveOpening(archiveOpeningsResponse.data);
      } catch (error) {
        console.error("Error fetching archive data:", error);
      }
    };

    fetchArchiveData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <TitleWrapper>
        <Typography variant="h5">Recruitment Rounds</Typography>
      </TitleWrapper>

      <div style={{ display: "flex", flexDirection: "column", rowGap: "20px", marginTop: "30px" }}>
        <Typography variant="h5">Active Recruitment Rounds</Typography>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={6}>
            <Grid container alignItems="center" justifyContent="flex-start">
              <TextField label="Search" variant="outlined" />
            </Grid>
          </Grid>
          <Grid item>
            <Button variant="contained">New Round</Button>
          </Grid>
        </Grid>
        <AdminOpeningsTable results={openings} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", rowGap: "20px", marginTop: "50px" }}>
        <Typography variant="h5">Archive Recruitment Rounds</Typography>
        <Grid item xs={6}>
          <Grid container alignItems="center" justifyContent="flex-start">
            <TextField label="Search" variant="outlined" />
          </Grid>
        </Grid>
        <ArchiveAdminOpeningsTable results={archiveOpenings} />
      </div>
    </>
  );
}

export default RecruitmentRoundDetailsPage;
