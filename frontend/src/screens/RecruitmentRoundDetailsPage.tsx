import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Box,
  Divider,
  Modal,
} from "@mui/material";
import styled from "styled-components";
import BackIcon from "../assets/BackIcon";
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

import { useRecruitmentStore } from "../util/stores/recruitmentStore";
import { useOpeningStore } from "../util/stores/openingStore";
import { useAuthStore } from "../util/stores/authStore";
import { getBaseAPIURL } from "../util/Util";

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

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function RecruitmentRoundDetailsPage() {
  const [rounds, setRounds] = useState<SingleRoundResultProps[]>([]);
  const [openings, setOpening] = useState<openingsResultProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const BASE_API_URL = getBaseAPIURL();

  const setRecruitmentDetails = useRecruitmentStore(
    (state) => state.setRecruitmentDetails,
  );

  const recruitmentDetails = useRecruitmentStore(
    (state) => state.recruitmentDetails,
  );

  const setSelectedOpening = useOpeningStore(
    (state) => state.setSelectedOpening,
  );

  const clearRecruitmentDetails = useRecruitmentStore(
    (state) => state.clearRecruitmentDetails,
  );
  const authStore = useAuthStore();
  useEffect(() => {
    const fetchData = async () => {
      if (recruitmentDetails.roundId === null) {
        console.error("No recruitment round ID selected");
        // Redirect if no ID is selected
        handleBack();
        return;
      }

      try {
        const roundsResponse = await axios.get(
          `${BASE_API_URL}/recruitment-round/${recruitmentDetails.roundId}`, // Working
        );
        const openingsResponse = await axios.get(
          `${BASE_API_URL}/recruitment-round/${recruitmentDetails.roundId}/opening`, // Working
        );
        setRounds(roundsResponse.data);
        setOpening(openingsResponse.data);
        setStatus(roundsResponse.data[0].status);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recruitmentDetails, status]);

  const updateStatus = async (statusChange: string) => {
    // Don't show loading for both buttons at once
    if (statusChange === "R") {
      setIsArchiving(true);
    } else {
      setIsUpdating(true);
    }
    const data = {
      status: statusChange,
    };
    try {
      await axios.patch(
        `${BASE_API_URL}/recruitment-round/${recruitmentDetails.roundId}/`, // Working
        data,
      );
      setStatus(statusChange);

      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error archiving round:", error);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
      setIsArchiving(false);
    }
  };

  const handleAddOpening = () => {
    setRecruitmentDetails({
      roundId: recruitmentDetails.roundId,
      roundApplicationDeadline: rounds[0].application_deadline,
      roundName: rounds[0]?.student_team_name + " " + rounds[0]?.id,
      roundStatus: rounds[0]?.status,
    });
    navigate("/create-opening");
  };

  const handleView = (
    id: number,
    recruitment_round_id: number,
    student_team_name: string,
    title: string,
    application_count: number,
  ) => {
    setSelectedOpening({
      id,
      recruitment_round_id,
      student_team_name,
      title,
      application_count,
    });
    navigate("/viewopen");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirm = () => {
    updateStatus("R");
    handleCloseModal();
  };

  const handleBack = () => {
    clearRecruitmentDetails();
    navigate("/viewrecruitmentround");
  };

  return (
    <>
      <HeadWrapper>
        <TitleWrapper>
          <IconButton onClick={() => handleBack()}>
            {loading ? (
              <Skeleton variant="circular" width={40} height={40} />
            ) : (
              <BackIcon />
            )}
          </IconButton>
          <Typography variant="h5">
            {loading ? (
              <Skeleton width={200} />
            ) : (
              `Recruitment Round: ${authStore.team_name} ${rounds[0]?.id}`
            )}
          </Typography>
        </TitleWrapper>
        {loading ? (
          <Skeleton variant="rectangular" width={150} height={40} />
        ) : status === "A" ? (
          /* Close Round button */
          <Button
            variant="contained"
            style={{
              color: "black",
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: "1px",
            }}
            disabled={isUpdating}
            onClick={() => {
              updateStatus("I");
            }}
          >
            {isUpdating ? <CircularProgress size={24} /> : "Close Round"}
          </Button>
        ) : (
          <div>
            {/* Archive Round Button */}
            <Button
              variant="outlined"
              style={{
                // color: "black",
                // backgroundColor: "white",
                // borderColor: "black",
                // borderWidth: "1px",
                marginRight: "10px",
              }}
              disabled={status === "R"}
              onClick={() => {
                setModalOpen(true);
              }}
            >
              {isArchiving ? <CircularProgress size={24} /> : "Archive Round"}
            </Button>
            {/* Activate Round Button */}
            <Button
              disabled={status === "R"}
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
          </div>
        )}
      </HeadWrapper>

      <div style={{ marginTop: "40px" }}>
        {loading ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(1)].map((_, index) => (
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <SingleRoundTable results={rounds} />
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
          marginTop: "100px",
        }}
      >
        <OpeningsWrapper>
          <Typography variant="h6">
            {loading ? <Skeleton width={200} /> : "Recruitment Round Openings"}
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddOpening}
            disabled={loading}
          >
            {loading ? <Skeleton width={100} /> : "Add Opening"}
          </Button>
        </OpeningsWrapper>
        {loading ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={80} height={30} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(4)].map((_, index) => (
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
                      <Skeleton variant="rectangular" width={80} height={30} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* Openings Table Component */
          <OpeningsTable results={openings} viewHandler={handleView} />
        )}
      </div>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        // aria-labelledby="archive-round-modal"
        // aria-describedby="team-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="team-info-modal"
            variant="h5"
            component="h2"
            gutterBottom
          >
            Warning
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {/* <Typography variant="h6" gutterBottom>
                        {selectedTeam?.student_team_name}
                    </Typography> */}
          <Typography variant="body1" paragraph>
            Are you sure you want to archive this round? <br></br>You will not
            be able to undo this action.
          </Typography>
          {/* <Typography variant="body1" paragraph>
                        Team Owner: <br></br>
                        {selectedTeam?.owner_email}
                    </Typography> */}
          <Button
            variant="outlined"
            onClick={handleCloseModal}
            sx={{ mt: 2, mr: 1 }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirm} sx={{ mt: 2 }}>
            Confirm
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default RecruitmentRoundDetailsPage;
