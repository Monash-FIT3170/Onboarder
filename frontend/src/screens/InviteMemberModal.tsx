import React, { useState } from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  open,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Owner");

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    const invitationData = { email, role };
    try {
      const response = await axios.post(
        "/api/invite-team-members",
        invitationData
      );
      if (response.status === 200) {
        alert("Invitation sent successfully to " + email + "!");
        onClose();
      } else {
        alert("Failed to send invitation.");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("There was an error sending the invitation.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Invite Member</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            placeholder="doe0001@student.monash.edu"
            value={email}
            onChange={handleEmailChange}
          />
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Role</FormLabel>
            <RadioGroup value={role} onChange={handleRoleChange}>
              <FormControlLabel
                value="Owner"
                control={<Radio />}
                label="Owner"
              />
              <FormControlLabel
                value="Admin"
                control={<Radio />}
                label="Admin"
              />
              <FormControlLabel
                value="Team Lead"
                control={<Radio />}
                label="Team Lead"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Send Invitation
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InviteMemberModal;
