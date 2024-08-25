import BackIcon from "../assets/BackIcon";
import { styled } from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";
import {
    Grid,
    Button,
    Typography,
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    CircularProgress,
    IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useApplicantStore } from "../util/stores/applicantStore";
import { useState, useEffect } from "react";
import React from "react";
import { useAuthStore } from "../util/stores/authStore";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

interface ResultProps {
    id: number;
    opening_id: number; // assuming deadline is a date in string format
    email: string;
    name: string;
    phone: string;
    semesters_until_completion: number;
    current_semester: number;
    course_enrolled: string;
    major_enrolled: string;
    additional_info: string;
    skills: string[];
    status: string;
    created_at: number;
    interview_date: string;
    interviewer_assigned: string;
  }

function Feedbacknote() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [openAccept, setOpenAccept] = React.useState(false);
    const [openReject, setOpenReject] = React.useState(false);
    const handleAccept = async () => {
        setOpenAccept(true);
    };
    const handleReject = async () => {
        setOpenReject(true);
    };
    const handleCloseAccpet = () => {
        setOpenAccept(false);
        navigate("");
    };
    const handleCloseReject = () => {
        setOpenReject(false);
        navigate("");
    };
    const authStore = useAuthStore();
    const handleBack = () => {
        clearSelectedApplicant();
        navigate("/viewopen");
      };

    const selectedApplicant = useApplicantStore((state) => state.selectedApplicant);
    const clearSelectedApplicant = useApplicantStore((state) => state.clearSelectedApplicant);
    const [applicantInformation, setApplicantInformation] = useState<
    ResultProps[]
  >([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedApplicant?.application_id) {
                console.error("No application ID selected");
                navigate("/viewopen");
                return;
            }
            console.log("selectedApplicant?.application_id", selectedApplicant?.application_id);
            try {
                const applicantResponse = await axios.get(
                    `http://127.0.0.1:3000/applications/${selectedApplicant?.application_id}`
                );
                console.log("applicantResponse", applicantResponse.data);
                setApplicantInformation(applicantResponse.data);
                console.log("applicantInformation", applicantInformation);
            } catch (error) {
                console.error("Error fetching applicant data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedApplicant]);

    return (
        <>
            <Grid container spacing={4} justifyContent="left">
                <Grid item xs={12} md={6}>
                    <div style={{ display: "flex", alignItems: "center", margin: "20px 10px" }}>
                        <IconButton onClick={() => handleBack()}>
                            <BackIcon />
                        </IconButton>
                        <Typography variant="h5" style={{ marginLeft: "10px" }}>
                            Note from Interview
                        </Typography>
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={12} columnSpacing={12} justifyContent="left">
                <Grid item xs={12} md={8} marginBlock={4}>
                    <Typography variant="body2" fontSize={20}>
                        Application Info
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center", margin: "10px 3px" }}>
                        <TextField
                            disabled
                            id="outlined-disabled"
                            label="Applicant Name"
                            defaultValue={`${applicantInformation[0]?.name}`}
                            variant="filled"
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", margin: "10px 3px" }}>
                        <TextField
                            disabled
                            id="outlined-disabled"
                            label="Interviewer"
                            defaultValue={`${applicantInformation[0]?.interviewer_assigned}`}
                            variant="filled"
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", margin: "10px 3px" }}>
                        <TextField
                            disabled
                            id="outlined-disabled"
                            label="Student team"
                            defaultValue={`${authStore.team_name}`}
                            variant="filled"
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", margin: "10px 3px" }}>
                        <TextField
                            disabled
                            id="outlined-disabled"
                            label="Date of Interview"
                            defaultValue={`${applicantInformation[0]?.interview_date}`}
                            variant="filled"
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", margin: "10px 3px" }}>
                        <TextField
                            disabled
                            id="outlined-disabled"
                            label="Position"
                            defaultValue={selectedApplicant?.recruitment_round_name}
                            variant="filled"
                        />
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="left">
                <div style={{ display: "flex", alignItems: "center", margin: "10px 3px" }}>
                    <Typography variant="body2" fontSize={20} margin={1}>
                        Score:
                    </Typography>
                    <TextField
                        disabled
                        id="outlined-disabled"
                        label="Out of 10"
                        defaultValue="10"
                        variant="filled"
                    />
                </div>
            </Grid>
            <Grid container spacing={4} justifyContent="left">
                <Grid item xs={12} md={3}>
                    <Typography variant="body2" fontSize={20}>
                        Feedback
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center", margin: "10px 3px" }}>
                        <TextField fullWidth label="Feedback note" variant="filled" />
                    </div>
                </Grid>
            </Grid>

            <Grid item container xs={12} justifyContent="center" spacing={2} margin="20px 10px">
                <Grid item>
                    <React.Fragment>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            onClick={handleAccept}
                        >
                            {loading ? <CircularProgress size={24} /> : "Accept"}
                        </Button>
                        <BootstrapDialog
                            onClose={handleCloseAccpet}
                            aria-labelledby="customized-dialog-title"
                            open={openAccept}
                        >
                            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                                Candidate [Name] Accepted!
                            </DialogTitle>
                            <DialogContent dividers>
                                <Typography gutterBottom>
                                    Candidate has been accepted as a Recruit for Monash Nova Rover
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={handleCloseAccpet}>
                                    Close
                                </Button>
                            </DialogActions>
                        </BootstrapDialog>
                    </React.Fragment>
                </Grid>

                <Grid item>
                    <React.Fragment>
                        <Button
                            variant="contained"
                            color="warning"
                            disabled={loading}
                            onClick={handleReject}
                        >
                            {loading ? <CircularProgress size={24} /> : "Reject"}
                        </Button>
                        <BootstrapDialog
                            onClose={handleCloseReject}
                            aria-labelledby="customized-dialog-title"
                            open={openReject}
                        >
                            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                                Candidate [Name] Rejected!
                            </DialogTitle>
                            <DialogContent dividers>
                                <Typography gutterBottom>
                                    Candidate has been rejected as a Recruit for Monash Nova Rover
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={handleCloseReject}>
                                    Close
                                </Button>
                            </DialogActions>
                        </BootstrapDialog>
                    </React.Fragment>
                </Grid>
            </Grid>
        </>
    );
}

export default Feedbacknote;
