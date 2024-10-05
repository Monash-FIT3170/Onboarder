import { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { formatDeadline, getBaseAPIURL } from "../util/Util";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuthStore } from "../util/stores/authStore";
import { useRecruitmentStore } from "../util/stores/recruitmentStore";

function CreateOpeningPage() {
  const [openingName, setOpeningName] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [desiredSkills, setDesiredSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogParam, setIsSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const BASE_API_URL = getBaseAPIURL();
  const navigate = useNavigate();

  const { team_name } = useAuthStore();
  const recruitmentDetails = useRecruitmentStore(
    (state) => state.recruitmentDetails,
  );

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
      status: `${recruitmentDetails.roundStatus}`,
      required_skills: requiredSkills,
      desired_skills: desiredSkills,
      task_email_format: "TEMPORARY FIX", // TODO
      task_enabled: false, // TODO
    };

    try {
      const response = await axios.post(
        `${BASE_API_URL}/recruitment-round/${recruitmentDetails.roundId}/opening`, // Working
        openingData,
      );
      if (response.status === 201) {
        // console.log(response);
        setOpen(true);
        setIsSuccessful(true);
      } else {
        // console.log(response);
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
    navigate("/recruitment-details-page");
  };

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h3" textAlign="center">
          Create Opening
        </Typography>
      </Grid>

      {/* Table for For Round and Deadline */}
      <Grid item xs={12}>
        <TableContainer
          component={Paper}
          elevation={0}
          style={{ border: "none" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    For Round
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    Application Deadline
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ borderBottom: "none" }}>
                  {team_name} {recruitmentDetails.roundId}
                </TableCell>
                <TableCell style={{ borderBottom: "none" }}>
                  {formatDeadline(recruitmentDetails.roundApplicationDeadline)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
              navigate("/recruitment-details-page");
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
