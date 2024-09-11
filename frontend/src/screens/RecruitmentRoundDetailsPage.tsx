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
} from "@mui/material";
import styled from "styled-components";
import BackIcon from "../assets/BackIcon";
import { OpeningsTable, openingsResultProps } from "../components/OpeningsTable";
import axios from "axios";
import { SingleRoundTable, SingleRoundResultProps } from "../components/SingleRoundTable";
import { useNavigate } from "react-router-dom";

import { useRecruitmentStore } from "../util/stores/recruitmentStore";
import { useOpeningStore } from "../util/stores/openingStore";
import { useAuthStore } from "../util/stores/authStore";

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
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const setRecruitmentDetails = useRecruitmentStore((state) => state.setRecruitmentDetails);

    const recruitmentDetails = useRecruitmentStore((state) => state.recruitmentDetails);

    const setSelectedOpening = useOpeningStore((state) => state.setSelectedOpening);

    const clearRecruitmentDetails = useRecruitmentStore((state) => state.clearRecruitmentDetails);
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
                    `http://127.0.0.1:3000/recruitment-round/${recruitmentDetails.roundId}` // Working
                );
                const openingsResponse = await axios.get(
                    `http://127.0.0.1:3000/recruitment-round/${recruitmentDetails.roundId}/opening` // Working
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
    }, [recruitmentDetails]);

    const updateStatus = async (statusChange: string) => {
        setIsUpdating(true);
        const data = {
            status: statusChange,
        };
        try {
            await axios.patch(
                `http://127.0.0.1:3000/recruitment-round/${recruitmentDetails.roundId}/`, // Working
                data
            );
            setStatus(statusChange);
            alert("Status updated successfully!");
        } catch (error) {
            console.error("Error archiving round:", error);
            alert("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddOpening = () => {
        setRecruitmentDetails({
            roundId: recruitmentDetails.roundId,
            roundDeadline: rounds[0].deadline,
            roundName: rounds[0]?.student_team_name + " " + rounds[0]?.id,
        });
        navigate("/create-opening");
    };

    const handleView = (
        id: number,
        recruitment_round_id: number,
        student_team_name: string,
        title: string,
        application_count: number
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
                            `${authStore.team_name} ${rounds[0]?.id}`
                        )}
                    </Typography>
                </TitleWrapper>
                {loading ? (
                    <Skeleton variant="rectangular" width={150} height={40} />
                ) : status === "A" ? (
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
                            {isUpdating ? <CircularProgress size={24} /> : "Archive Round"}
                        </Button>
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
                    <Button variant="contained" onClick={handleAddOpening} disabled={loading}>
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
                                            <Skeleton
                                                variant="rectangular"
                                                width={80}
                                                height={30}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <OpeningsTable results={openings} viewHandler={handleView} />
                )}
            </div>
        </>
    );
}

export default RecruitmentRoundDetailsPage;
