import React, { useState } from "react";
import {
  Grid,
  Button,
  Typography,
  TextField,
  Autocomplete,
  Chip,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { formatDeadline } from "../util/Util";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function CreateOpeningPage() {
  const [openingName, setOpeningName] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [desiredSkills, setDesiredSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogParam, setIsSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const state = location.state as {
    deadline: string;
    roundId: number;
    round: string;
  };

  const handleSubmit = async () => {
    if (
      !openingName ||
      !description ||
      !requiredSkills ||
      !desiredSkills ||
      openingName.length <= 0 ||
      description.length <= 0 ||
      requiredSkills.length <= 0 ||
      desiredSkills.length <= 0
    ) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    const openingData = {
      title: openingName,
      description: description,
      status: "I",
      required_skills: requiredSkills,
      desired_skills: desiredSkills,
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:3000/recruitmentRounds/${state.roundId}/openings`,
        openingData
      );
      if (response.status === 201) {
        console.log(response);
        setOpen(true);
        setIsSuccessful(true);
      } else {
        console.log(response);
        setOpen(true);
        setIsSuccessful(false);
      }
    } catch (error) {
      console.error("There was an error!", error);
      setOpen(true);
      setIsSuccessful(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/recruitment-details-page", {
      state: {
        recruitment_round_id: state.roundId,
      },
    });
  };

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h3" textAlign="center">
          Create Opening
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body2" fontSize={20}>
          Name:
        </Typography>
        <TextField
          fullWidth
          label="Enter Opening Name"
          size="small"
          value={openingName}
          onChange={(e) => setOpeningName(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body2" fontSize={20}>
          Description:
        </Typography>
        <TextField
          fullWidth
          label="Enter Opening Description"
          size="small"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body2" fontSize={20}>
          For Round:
        </Typography>
        <TextField
          fullWidth
          value={state.round}
          InputProps={{
            readOnly: true,
          }}
          disabled={true}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body2" fontSize={20}>
          Deadline:
        </Typography>
        <TextField
          fullWidth
          value={formatDeadline(state.deadline)}
          InputProps={{
            readOnly: true,
          }}
          disabled={true}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body2" fontSize={20}>
          Required Skills:
        </Typography>
        <Autocomplete
          fullWidth
          multiple
          freeSolo
          options={[]}
          value={requiredSkills}
          onChange={(event, newValue) => {
            setRequiredSkills(newValue);
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip key={index} label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => <TextField {...params} label="Add skills" />}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body2" fontSize={20}>
          Desired Skills:
        </Typography>
        <Autocomplete
          fullWidth
          multiple
          freeSolo
          options={[]}
          value={desiredSkills}
          onChange={(event, newValue) => {
            setDesiredSkills(newValue);
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip key={index} label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => <TextField {...params} label="Add skills" />}
        />
      </Grid>

      <Grid item container xs={12} justifyContent="center" spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="warning" onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogContentText>
            {dialogParam
              ? "Opening successfully created!"
              : "There was an error in creating the opening! Please try again later!"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              navigate("/recruitment-details-page", {
                state: {
                  recruitment_round_id: state.roundId,
                },
              });
            }}
          >
            Go to Openings Table
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              setOpeningName("");
              setDescription("");
              setDesiredSkills([]);
              setRequiredSkills([]);
            }}
          >
            Create More Openings
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default CreateOpeningPage;
