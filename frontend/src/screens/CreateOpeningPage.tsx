import {
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PermissionButton from "../components/PermissionButton";
import { useAuthStore } from "../util/stores/authStore";
import { useRecruitmentStore } from "../util/stores/recruitmentStore";
import EmailConfigModal from "../components/EmailConfigModal";
import { formatDeadline, getBaseAPIURL } from "../util/Util";

function CreateOpeningPage() {
  const [openingName, setOpeningName] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [desiredSkills, setDesiredSkills] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [dialogParam, setIsSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const BASE_API_URL = getBaseAPIURL();
  const navigate = useNavigate();
  const [isEmailConfigModalOpen, setIsEmailConfigModalOpen] = useState(false);
  const { team_name } = useAuthStore();
  const recruitmentDetails = useRecruitmentStore(
    (state) => state.recruitmentDetails,
  );
  const [taskOn, setTaskOn] = useState(false);
  const [emailBody, setEmailBody] = useState("");

  const handleOpenEmailConfigModal = () => {
    setIsEmailConfigModalOpen(true);
  };

  const handleCloseEmailConfigModal = () => {
    setIsEmailConfigModalOpen(false);
  };

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (openingName.trim().length === 0) {
      newErrors.openingName = "Opening name is required";
    } else if (openingName.length > 100) {
      newErrors.openingName = "Opening name must be 100 characters or less";
    }

    if (description.trim().length === 0) {
      newErrors.description = "Description is required";
    } else if (description.length > 500) {
      newErrors.description = "Description must be 500 characters or less";
    }

    if (requiredSkills.length === 0) {
      newErrors.requiredSkills = "At least one required skill is needed";
    }

    if (desiredSkills.length === 0) {
      newErrors.desiredSkills = "At least one desired skill is needed";
    }

    setErrors(newErrors);
  }, [openingName, description, requiredSkills, desiredSkills]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleSubmit = async () => {
    validateForm();
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    const openingData = {
      title: openingName.trim(),
      description: description.trim(),
      status: `${recruitmentDetails.roundStatus}`,
      required_skills: requiredSkills,
      desired_skills: desiredSkills,
      task_email_format: emailBody, // TODO
      task_enabled: taskOn, // TODO
    };

    try {
      const response = await axios.post(
        `${BASE_API_URL}/recruitment-round/${recruitmentDetails.roundId}/opening`,
        openingData,
      );
      if (response.status === 201) {
        setOpen(true);
        setIsSuccessful(true);
      } else {
        throw new Error("Unexpected response status");
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
    navigate("/recruitment-round-details");
  };

  const handleSkillChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    newValue: string[],
  ) => {
    const sanitizedSkills = newValue
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
    setter(sanitizedSkills);
  };

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h4" textAlign="center">
          Create Opening
        </Typography>
      </Grid>

      {/* Table for Round and Deadline */}
      <Grid item xs={12}>
        <TableContainer
          component={Paper}
          // elevation={0}
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
                  {recruitmentDetails.roundApplicationDeadline
                    ? formatDeadline(
                        recruitmentDetails.roundApplicationDeadline,
                      )
                    : "Not set"}
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
          error={!!errors.openingName}
          helperText={errors.openingName}
          required
        />
        <Button
          variant="outlined"
          onClick={handleOpenEmailConfigModal}
          sx={{ m: 2, ml: 0, mb: 0, mt: 3 }}
        >
          CONFIGURE INTERVIEW SCHEDULING EMAIL
        </Button>
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
          error={!!errors.description}
          helperText={errors.description}
          required
          multiline
          rows={4}
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
          onChange={(_event, newValue) =>
            handleSkillChange(setRequiredSkills, newValue)
          }
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                key={`required-${index}`}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add skills"
              error={!!errors.requiredSkills}
              helperText={errors.requiredSkills}
              required
            />
          )}
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
          onChange={(_event, newValue) =>
            handleSkillChange(setDesiredSkills, newValue)
          }
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                key={`desired-${index}`}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add skills"
              error={!!errors.desiredSkills}
              helperText={errors.desiredSkills}
              required
            />
          )}
        />
      </Grid>

      <Grid item container xs={12} justifyContent="center" spacing={2}>
        <Grid item>
          <PermissionButton
            action="create"
            subject="Opening"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || Object.keys(errors).length > 0}
            tooltipText="You do not have permission to create an opening"
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </PermissionButton>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
      <EmailConfigModal
        open={isEmailConfigModalOpen}
        onClose={handleCloseEmailConfigModal}
        setEmailBodyNew={setEmailBody}
        setTaskOnNew={setTaskOn}
        newOpening={true}
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        style={{ margin: "20px" }}
      >
        <DialogContent>
          <DialogContentText>
            {dialogParam
              ? "Opening successfully created!"
              : "There was an error in creating the opening. Please try again later."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              navigate("/recruitment-round-details", { replace: true });
            }}
          >
            Go to Openings Table
          </Button>
          <PermissionButton
            action="create"
            subject="Opening"
            onClick={() => {
              setOpen(false);
              setOpeningName("");
              setDescription("");
              setDesiredSkills([]);
              setRequiredSkills([]);
            }}
            tooltipText="You do not have permission to create more openings"
          >
            Create More Openings
          </PermissionButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default CreateOpeningPage;
