import { useState, useEffect } from "react";
import { Typography, Button, CircularProgress } from "@mui/material";
import styled from "styled-components";
import BackIcon from "../assets/BackIcon";
import LoadingSpinner from "../components/LoadSpinner";
import {
  OpeningsTable,
  openingsResultProps,
} from "../components/OpeningsTable";
import axios from "axios";
import {
  SingleRoundTable,
  SingleRoundResultProps,
} from "../components/SingleRoundTable";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {
    recruitment_round_id: number;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roundsResponse = await axios.get(
          `http://127.0.0.1:3000/recruitmentRounds/${state.recruitment_round_id}`
        );
        const openingsResponse = await axios.get(
          `http://127.0.0.1:3000/recruitmentRounds/${state.recruitment_round_id}/openings`
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
  }, [state.recruitment_round_id]);

  const updateStatus = async (statusChange: string) => {
    setIsUpdating(true);
    const data = {
      status: statusChange,
    };
    try {
      await axios.patch(
        `http://127.0.0.1:3000/recruitmentRounds/${state.recruitment_round_id}/status`,
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
      {/* Single Recruitment Round Table */}
      <HeadWrapper>
        <TitleWrapper>
          <BackIcon />
          <Typography variant="h5">
            {`${rounds[0]?.student_team_name} ${rounds[0]?.id}`}
          </Typography>
        </TitleWrapper>
        {rounds[0]?.status === "A" ? (
          <Button
            variant="outlined"
            style={{
              color: "black",
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: "1px",
            }}
            disabled={isUpdating}
            onClick={() => {
              updateStatus("R");
            }}
          >
            {isUpdating ? (
              <CircularProgress size={24} />
            ) : (
              "Archive Round and Send Results"
            )}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              updateStatus("A");
            }}
          >
            {isUpdating ? (
              <CircularProgress size={24} style={{ color: "white" }} />
            ) : (
              "Activate Round"
            )}
          </Button>
        )}
      </HeadWrapper>
      <div style={{ marginTop: "40px" }}>
        <SingleRoundTable results={rounds} />
      </div>

      {/* Openings for Recruitment Round Table */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
          marginTop: "100px",
        }}
      >
        <OpeningsWrapper>
          <Typography variant="h6">Recruitment Round Openings</Typography>
          <Button variant="contained" onClick={handleAddOpening}>
            {" "}
            Add Opening{" "}
          </Button>
        </OpeningsWrapper>
        <OpeningsTable results={openings}></OpeningsTable>
      </div>
    </>
  );
}

export default RecruitmentRoundDetailsPage;
