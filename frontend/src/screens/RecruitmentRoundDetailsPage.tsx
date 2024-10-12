import { useState, useEffect, useCallback } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import styled from "styled-components";
import BackIcon from "../assets/BackIcon";
import {
  OpeningsTable,
  openingsResultProps,
} from "../components/OpeningsTable";
import axios, { AxiosError } from "axios";
import {
  SingleRoundTable,
  SingleRoundResultProps,
} from "../components/SingleRoundTable";
import { useNavigate } from "react-router-dom";

import { useRecruitmentStore } from "../util/stores/recruitmentStore";
import { useOpeningStore } from "../util/stores/openingStore";
import { useAuthStore } from "../util/stores/authStore";
import { getBaseAPIURL } from "../util/Util";
import PermissionButton from "../components/PermissionButton";

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
  const [error, setError] = useState<string | null>(null);
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

  const handleBack = useCallback(() => {
    clearRecruitmentDetails();
    navigate("/view-recruitment-rounds");
  }, [clearRecruitmentDetails, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (recruitmentDetails.roundId === null) {
        setError("No recruitment round ID selected");
        handleBack();
        return;
      }

      try {
        const [roundsResponse, openingsResponse] = await Promise.all([
          axios.get(
            `${BASE_API_URL}/recruitment-round/${recruitmentDetails.roundId}`,
          ),
          axios.get(
            `${BASE_API_URL}/recruitment-round/${recruitmentDetails.roundId}/opening`,
          ),
        ]);

        setRounds(roundsResponse.data);
        setOpening(openingsResponse.data);
        setStatus(roundsResponse.data[0]?.status || "");
      } catch (error) {
        const axiosError = error as AxiosError;
        setError(`Error fetching data: ${axiosError.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recruitmentDetails, status, BASE_API_URL, handleBack]);

  const updateStatus = async (statusChange: string) => {
    if (statusChange !== "R" && statusChange !== "A" && statusChange !== "I") {
      setError("Invalid status change requested");
      return;
    }

    setIsUpdating(statusChange !== "R");
    setIsArchiving(statusChange === "R");

    try {
      await axios.patch(
        `${BASE_API_URL}/recruitment-round/${recruitmentDetails.roundId}/`,
        { status: statusChange },
      );
      setStatus(statusChange);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(`Failed to update status: ${axiosError.message}`);
    } finally {
      setIsUpdating(false);
      setIsArchiving(false);
    }
  };

  const handleAddOpening = () => {
    if (rounds.length === 0) {
      setError("No round data available");
      return;
    }

    setRecruitmentDetails({
      roundId: recruitmentDetails.roundId,
      roundApplicationDeadline: rounds[0].application_deadline,
      roundInterviewPreferenceDeadline: rounds[0].interview_preference_deadline,
      roundInterviewPeriod: Array.isArray(rounds[0].interview_period)
        ? rounds[0].interview_period.join(", ")
        : rounds[0].interview_period || "",
      roundName: `${rounds[0]?.student_team_name} ${rounds[0]?.id}`,
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
    navigate("/opening-details");
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleConfirm = () => {
    updateStatus("R");
    handleCloseModal();
  };

  const handleErrorClose = () => setError(null);

  return (
    <>
      <HeadWrapper>
        <TitleWrapper>
          <IconButton onClick={handleBack} disabled={loading}>
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
              `Recruitment Round: ${authStore.team_name} ${rounds[0]?.id || ""}`
            )}
          </Typography>
        </TitleWrapper>
        {loading ? (
          <Skeleton variant="rectangular" width={150} height={40} />
        ) : status === "A" ? (
          /* Close Round button */
          <PermissionButton
            action="close"
            subject="Round"
            variant="contained"
            disabled={isUpdating}
            onClick={() => {
              updateStatus("I");
            }}
            tooltipText="You do not have permission to close this round"
          >
            {isUpdating ? <CircularProgress size={24} /> : "Close Round"}
          </PermissionButton>
        ) : (
          <div>
            {/* Archive Round Button */}
            <PermissionButton
              action="archive"
              subject="Round"
              variant="outlined"
              style={{
                marginRight: "10px",
              }}
              disabled={status === "R"}
              onClick={() => {
                setModalOpen(true);
              }}
            >
              {isArchiving ? <CircularProgress size={24} /> : "Archive Round"}
            </PermissionButton>
            {/* Activate Round Button */}
            <PermissionButton
              action="update"
              subject="Round"
              disabled={status === "R"}
              variant="contained"
              onClick={() => {
                updateStatus("A");
              }}
              tooltipText="You do not have permission to activate this round"
            >
              {isUpdating ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "Activate Round"
              )}
            </PermissionButton>
          </div>
        )}
      </HeadWrapper>

      <div style={{ marginTop: "40px" }}>
        {loading ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {[...Array(6)].map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {[...Array(6)].map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
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
          <PermissionButton
            action="create"
            subject="Opening"
            variant="contained"
            onClick={handleAddOpening}
            disabled={loading || status !== "A"}
            tooltipText="You do not have permission to add an opening"
          >
            {loading ? <Skeleton width={100} /> : "Add Opening"}
          </PermissionButton>
        </OpeningsWrapper>
        {loading ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {[...Array(4)].map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton
                        variant="text"
                        width={index === 2 ? 200 : 100}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(4)].map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {[...Array(4)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {cellIndex === 3 ? (
                          <Skeleton
                            variant="rectangular"
                            width={80}
                            height={30}
                          />
                        ) : (
                          <Skeleton variant="text" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <OpeningsTable results={openings} viewHandler={handleView} />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="archive-round-modal"
      >
        <Box sx={modalStyle}>
          <Typography
            id="archive-round-modal"
            variant="h5"
            component="h2"
            gutterBottom
          >
            Warning
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph>
            Are you sure you want to archive this round? <br />
            You will not be able to undo this action.
          </Typography>
          <Button
            variant="outlined"
            onClick={handleCloseModal}
            sx={{ mt: 2, mr: 1 }}
          >
            Cancel
          </Button>
          <PermissionButton
            action="archive"
            subject="Round"
            variant="contained"
            onClick={handleConfirm}
            sx={{ mt: 2 }}
            tooltipText="You do not have permission to archive this round"
          >
            Confirm
          </PermissionButton>
        </Box>
      </Modal>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleErrorClose}
      >
        <Alert
          onClose={handleErrorClose}
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
