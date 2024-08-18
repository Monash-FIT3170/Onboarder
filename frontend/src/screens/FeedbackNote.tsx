import React, { useState } from "react";
import BackIcon from "../assets/BackIcon";
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
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
  
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  function Feedbacknote() {
    const navigate = useNavigate();
    const [loading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const handleAccept = async () => {
        setOpen(true)
    }
    const handleReject = async () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        navigate("");
    };
    const handleBack = () => {
        navigate(""); // View recruitment round details page 
      }
    return(
        <>
        <Grid container spacing={4} justifyContent="left">
            <Grid item xs={12} md={6}>
            <div
            style={{ display: "flex", alignItems: "center", margin: "20px 10px" }}>
            <IconButton
            onClick={() => handleBack() }>
            <BackIcon />
            </IconButton>
            <Typography variant="h5" style={{ marginLeft: "10px" }}>
            Note from Interview
            </Typography>
            </div>
            </Grid>
        </Grid>
        <Grid container spacing={12} columnSpacing={12} justifyContent="left">
            <Grid item xs={12} md={8} marginBlock = {4}>
            <Typography variant="body2" fontSize={20}>
            Application Info
            </Typography>
            <div style={{ display: "flex", alignItems: "center", margin: "10px 3px" }}>
                <TextField
                disabled
                id="outlined-disabled"
                label="Applicant Name"
                defaultValue="John"
                variant="filled"
                />
            </div>

            <div style={{ display: "flex", alignItems: "center", margin: "10px 3px" }}>
                <TextField
                disabled
                id="outlined-disabled"
                label="Interviewer"
                defaultValue="Sam"
                variant="filled"
                />
            </div>

            <div style={{ display: "flex", alignItems: "center", margin: "10px 3px" }}>
                <TextField
                disabled
                id="outlined-disabled"
                label="Student team"
                defaultValue="Nova Rover"
                variant="filled"
                />
            </div>
            
            <div style={{ display: "flex", alignItems: "center", margin: "10px 3px" }}>
                <TextField
                disabled
                id="outlined-disabled"
                label="Date of Interview"
                defaultValue="12/12/2024"
                variant="filled"
                />
            </div>

            <div style={{ display: "flex", alignItems: "center", margin: "10px 3px" }}>
                <TextField
                disabled
                id="outlined-disabled"
                label="Position"
                defaultValue="Event"
                variant="filled"
                />
            </div>
            
           
           
            </Grid>
        </Grid>
        <Grid container spacing={2} md={1} justifyContent="left">
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
                    <TextField
                    fullWidth
                    label="Feedback note"
                    variant="filled"
                    />
                </div>
               
                </Grid>
        </Grid>

        
        <Grid item container xs={12} justifyContent="center" spacing={2} margin ="20px 10px">
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
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
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
                    <Button autoFocus onClick={handleClose}>
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
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
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
                    <Button autoFocus onClick={handleClose}>
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