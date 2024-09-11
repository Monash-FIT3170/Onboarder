import { Box, TextField, Typography, Button, Switch, FormControlLabel } from "@mui/material";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useOpeningStore } from "../util/stores/openingStore";

const TaskEmailFormatPage: React.FC = (): React.ReactNode => {
    const [taskOn, setTaskOn] = useState(false);
    const [emailBody, setEmailBody] = useState("");
    // const [loading, setLoading] = useState(true);
    // const [open, setOpen] = useState(false);
    const [dialogParam, setDialogParam] = useState("");

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskOn(event.target.checked);
    };
    const navigate = useNavigate();
    const selectedOpening = useOpeningStore((state) => state.selectedOpening);

    const handleBack = () => {
        // clearSelectedOpening();
        navigate("/viewopen");
    };
    const handleConfirm = async (event: any) => {
        event.preventDefault();
        // setLoading(true);
        const submissionData = {
            task_enabled: taskOn,
            task_email_format: emailBody,
        };
        try {
            const response = await axios.patch(
                `http://127.0.0.1:3000/opening/${selectedOpening.id}`, // Working
                submissionData
            );
            if (response.status === 201) {
                // console.log(response);
                setDialogParam("Task Updated!");
            } else {
                // console.log(response);
                setDialogParam("There was an error updating the email.");
            }
        } catch (error) {
            console.error("There was an error!", error);
        } finally {
            //   setOpen(true);
            //   setLoading(false);
            handleBack();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedOpening?.id) {
                console.error("No opening ID selected");
                navigate("/viewopen");
                return;
            }
            try {
                const openingResponse = await axios.get(
                    `http://127.0.0.1:3000/opening/${selectedOpening.id}` // Working
                );
                console.log(openingResponse);
                setEmailBody(openingResponse.data[0].opening_task_email_format);
                setTaskOn(openingResponse.data[0].opening_task_enabled);
            } catch (error) {
                console.error("Error fetching applicant data:", error);
            } finally {
                // setLoading(false);
            }
        };

        fetchData();
    }, [selectedOpening]);

    return (
        <Box sx={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <Typography variant="h5" sx={{ marginBottom: "20px" }}>
                Email Configuration
            </Typography>

            <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                Email Format
            </Typography>

            <Typography
                variant="body1"
                paragraph
                sx={{ outline: "1px solid", outlineColor: "grey.500", padding: "10px" }}
            >
                Dear Candidate,
                <br />
                Congratulations on progressing to the next stage of our recruitment process. We're
                impressed with your application and look forward to learning more about you.
                <br />
                To move forward, please provide your availability for the next steps by clicking on
                the following link: Enter Availability. We kindly ask that you complete this within
                the next 3 business days.
                <br />
                If you have any questions about the process or require any accommodations, please
                don't hesitate to reach out.
                <br />
                We look forward to speaking with you soon.
                <br />
                Best regards,
                <br />
                Team Name
            </Typography>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                }}
            >
                <Typography variant="h6">Task Details (Optional)</Typography>
                <FormControlLabel
                    control={<Switch checked={taskOn} onChange={handleToggle} />}
                    label="Task On?"
                />
            </div>
            <TextField
                label="Task Body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                fullWidth
                multiline
                rows={4}
                sx={{ marginBottom: "20px" }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" onClick={handleConfirm}>
                    Confirm
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleBack}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default TaskEmailFormatPage;
