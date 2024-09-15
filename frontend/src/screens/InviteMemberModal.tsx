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
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { getBaseAPIURL } from "../util/Util";

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  teamId: number | null;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  open,
  onClose,
  teamId,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("T");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const BASE_API_URL = getBaseAPIURL();

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
      setSnackbar({
        open: true,
        message: "Please enter a valid email address.",
        severity: "error",
      });
      return;
    }

    if (!teamId) {
      setSnackbar({
        open: true,
        message: "Team information is missing.",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_API_URL}/student-team/${teamId}/members`, // Fixed not tested
        {
          email: email,
          role: role,
        }
      );

      if (response.status === 201) {
        setSnackbar({
          open: true,
          message: "Team member added successfully!",
          severity: "success",
        });
        onClose();
      } else {
        setSnackbar({
          open: true,
          message: "Failed to added team member.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      setSnackbar({
        open: true,
        message: "There was an error adding the team member.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Add Team Member</Typography>
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
              required
            />
            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Role</FormLabel>
              <RadioGroup value={role} onChange={handleRoleChange}>
                <FormControlLabel value="O" control={<Radio />} label="Owner" />
                <FormControlLabel value="A" control={<Radio />} label="Admin" />
                <FormControlLabel
                  value="T"
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Add Member"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InviteMemberModal;
