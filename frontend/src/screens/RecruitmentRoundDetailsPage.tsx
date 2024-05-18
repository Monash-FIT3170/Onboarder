import { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
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

  // const archiveRound = async (id) => {
  //   try {
  //     await axios.post(`/api/recruitment-rounds/${id}/archive`);
  //     // Update the state to remove the archived round
  //     setRound((prevRound) => prevRound.filter((round) => round.id !== id));
  //   } catch (error) {
  //     console.error("Error archiving round:", error);
  //   }
  // };

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
        {rounds[0]?.status === "R" ? (
          <Button
            variant="outlined"
            style={{
              color: "black",
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: "1px",
            }}
          >
            Archive Round and Send Results
          </Button>
        ) : (
          <Button variant="contained">Activate Round</Button>
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
