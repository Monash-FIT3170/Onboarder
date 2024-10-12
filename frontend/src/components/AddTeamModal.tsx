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
import PermissionButton from "./PermissionButton";

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
              multiline
              rows={4}
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained">
          Cancel
        </Button>
        <PermissionButton
          action="create"
          subject="Opening"
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          tooltipText="You do not have permission to create a team"
        >
          Create
        </PermissionButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddTeamModal;
