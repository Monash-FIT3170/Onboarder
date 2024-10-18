import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";

interface AddTeamModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (teamName: string, teamDescription: string) => void;
}

const AddTeamModal: React.FC<AddTeamModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  const handleSubmit = () => {
    onSubmit(teamName, teamDescription);
    setTeamName("");
    setTeamDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Team details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Team name"
              placeholder="E.g. MCAV"
              type="text"
              fullWidth
              variant="outlined"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Team description"
              type="text"
              fullWidth
              variant="outlined"
              placeholder="E.g. Monash Connected Autonomous Vehicle"
              multiline
              rows={4}
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {/* <PermissionButton
          action="create"
          subject="Team"
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          tooltipText="You do not have permission to create a team"
        >
          Create
        </PermissionButton> */}
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Create
        </Button>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTeamModal;
