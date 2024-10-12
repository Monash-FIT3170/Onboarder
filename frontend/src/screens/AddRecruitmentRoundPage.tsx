import Grid from "@mui/material/Grid";
import { useState, useEffect, useCallback } from "react";
import {
  Select,
  MenuItem,
  Button,
  TextField,
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
  Typography,
  FormHelperText,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../util/stores/authStore";
import { getBaseAPIURL } from "../util/Util";
import PermissionButton from "../components/PermissionButton";

interface FormErrors {
  year: string;
  semester: string;
  application_deadline: string;
  interview_preference_deadline: string;
  interview_period_start: string;
  interview_period_end: string;
}

const validateForm = (
  year: string,
  semester: string,
  application_deadline: DateTime | null,
  interview_preference_deadline: DateTime | null,
  interview_period_start: DateTime | null,
  interview_period_end: DateTime | null,
): FormErrors => {
  const errors: FormErrors = {
    year: "",
    semester: "",
    application_deadline: "",
    interview_preference_deadline: "",
    interview_period_start: "",
    interview_period_end: "",
  };

  if (!year) {
    errors.year = "Year is required";
  } else if (!/^\d{4}$/.test(year)) {
    errors.year = "Year must be a 4-digit number";
  }

  if (!semester) {
    errors.semester = "Semester is required";
  }

  if (!application_deadline) {
    errors.application_deadline = "Application deadline is required";
  }

  if (!interview_preference_deadline) {
    errors.interview_preference_deadline =
      "Interview preference deadline is required";
  }

  if (!interview_period_start) {
    errors.interview_period_start = "Interview period start is required";
  }

  if (!interview_period_end) {
    errors.interview_period_end = "Interview period end is required";
  }

  if (
    application_deadline &&
    interview_preference_deadline &&
    application_deadline > interview_preference_deadline
  ) {
    errors.application_deadline =
      "Application deadline cannot be after the interview preference deadline";
  }

  if (
    interview_preference_deadline &&
    interview_period_start &&
    interview_preference_deadline > interview_period_start
  ) {
    errors.interview_preference_deadline =
      "Interview preference deadline cannot be after the interview period start date";
  }

  if (
    interview_period_start &&
    interview_period_end &&
    interview_period_start > interview_period_end
  ) {
    errors.interview_period_start =
      "Interview period start date cannot be after the end date";
  }

  return errors;
};

const AddRecruitmentRoundPage = () => {
  const [application_deadline, setApplicationDeadline] =
    useState<DateTime | null>(DateTime.now().plus({ days: 1 }));
  const [interview_preference_deadline, setInterviewPreferenceDeadline] =
    useState<DateTime | null>(DateTime.now().plus({ days: 2 }));
  const [interview_period_start, setInterviewPeriodStart] =
    useState<DateTime | null>(DateTime.now().plus({ days: 3 }).startOf("day"));
  const [interview_period_end, setInterviewPeriodEnd] =
    useState<DateTime | null>(DateTime.now().plus({ days: 4 }).startOf("day"));
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [open, setOpen] = useState(false);
  const [dialogParam, setIsSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    year: "",
    semester: "",
    application_deadline: "",
    interview_preference_deadline: "",
    interview_period_start: "",
    interview_period_end: "",
  });

  const navigate = useNavigate();
  const authStore = useAuthStore();
  const studentTeamId = authStore.team_id;
  const studentTeamName = authStore.team_name;
  const BASE_API_URL = getBaseAPIURL();
  const API_URL = `${BASE_API_URL}/student-team/${studentTeamId}/recruitment-round/`;

  const memoizedValidateForm = useCallback(() => {
    const newErrors = validateForm(
      year,
      semester,
      application_deadline,
      interview_preference_deadline,
      interview_period_start,
      interview_period_end,
    );
    setErrors(newErrors);
  }, [
    year,
    semester,
    application_deadline,
    interview_preference_deadline,
    interview_period_start,
    interview_period_end,
  ]);

  useEffect(() => {
    memoizedValidateForm();
  }, [memoizedValidateForm]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    memoizedValidateForm();

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        application_deadline: application_deadline?.toString(),
        interview_preference_deadline:
          interview_preference_deadline?.toString(),
        interview_period: [
          interview_period_start?.toString(),
          interview_period_end?.toString(),
        ],
        semester: semester,
        year: year,
        status: "I",
      });
      if (response.status === 201) {
        setOpen(true);
        setIsSuccessful(true);
      } else {
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

  return (
    <div>
      <main>
        <h1 style={{ textAlign: "center", fontSize: "3em", fontWeight: "75" }}>
          Create Recruitment Round
        </h1>
      </main>
      <form onSubmit={handleSubmit}>
        <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Team</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{studentTeamName}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ marginTop: "20px" }}
        >
          <Grid item xs={12} sm={6} sx={{ marginBottom: "8px" }}>
            <Typography variant="body2" fontSize={20}>
              Year:
            </Typography>
            <TextField
              placeholder="Enter year of round"
              fullWidth
              value={year}
              onChange={(e) => setYear(e.target.value)}
              error={!!errors.year}
              helperText={errors.year}
            />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ marginBottom: "8px" }}>
            <Typography variant="body2" fontSize={20}>
              Application Deadline:
            </Typography>
            <LocalizationProvider
              dateAdapter={AdapterLuxon}
              adapterLocale="en-us"
            >
              <DateTimePicker
                label="Date Picker"
                value={application_deadline}
                onChange={(newValue) => {
                  if (newValue)
                    setApplicationDeadline(newValue.endOf("minute"));
                }}
                defaultValue={DateTime.now().startOf("minute")}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.application_deadline,
                    helperText: errors.application_deadline,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontSize={20}>
              Semester:
            </Typography>
            <Select
              value={semester}
              fullWidth
              onChange={(e) => setSemester(e.target.value)}
              error={!!errors.semester}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </Select>
            {errors.semester && (
              <FormHelperText error>{errors.semester}</FormHelperText>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontSize={20}>
              Interview Preference Deadline:
            </Typography>
            <LocalizationProvider
              dateAdapter={AdapterLuxon}
              adapterLocale="en-us"
            >
              <DateTimePicker
                label="Date Picker"
                value={interview_preference_deadline}
                onChange={(newValue) => {
                  if (newValue)
                    setInterviewPreferenceDeadline(newValue.endOf("minute"));
                }}
                defaultValue={DateTime.now()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.interview_preference_deadline,
                    helperText: errors.interview_preference_deadline,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontSize={20}>
              Interview Period Start:
            </Typography>
            <LocalizationProvider
              dateAdapter={AdapterLuxon}
              adapterLocale="en-us"
            >
              <DateTimePicker
                label="Start Date"
                value={interview_period_start}
                onChange={(newValue) => {
                  if (newValue)
                    setInterviewPeriodStart(newValue.startOf("day"));
                }}
                defaultValue={DateTime.now().startOf("day")}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.interview_period_start,
                    helperText: errors.interview_period_start,
                  },
                }}
                views={["year", "month", "day"]}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontSize={20}>
              Interview Period End:
            </Typography>
            <LocalizationProvider
              dateAdapter={AdapterLuxon}
              adapterLocale="en-us"
            >
              <DateTimePicker
                label="End Date"
                value={interview_period_end}
                onChange={(newValue) => {
                  if (newValue) setInterviewPeriodEnd(newValue.endOf("day"));
                }}
                defaultValue={DateTime.now()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.interview_period_end,
                    helperText: errors.interview_period_end,
                  },
                }}
                views={["year", "month", "day"]}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item container xs={12} justifyContent="center" spacing={2}>
            <Grid item>
              <PermissionButton
                action="create"
                subject="Round"
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={loading}
                onClick={() => {}}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </PermissionButton>
            </Grid>
            <Grid item>
              <Link
                to="/view-recruitment-rounds"
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" color="error" size="large">
                  Cancel
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogContentText>
            {dialogParam
              ? "Recruitment Round has been successfully created!"
              : "There was an error in creating the Recruitment Round!\nPlease try again later!"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              navigate("/view-recruitment-rounds");
            }}
          >
            GO TO ROUNDS TABLE
          </Button>
          <PermissionButton
            action="create"
            subject="Round"
            onClick={() => {
              setOpen(false);
              setApplicationDeadline(DateTime.now()),
                setInterviewPreferenceDeadline(DateTime.now()),
                setInterviewPeriodStart(DateTime.now()),
                setInterviewPeriodEnd(DateTime.now()),
                setSemester(""),
                setYear("");
            }}
            tooltipText="You don't have permission to create new rounds"
          >
            CREATE MORE ROUNDS
          </PermissionButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddRecruitmentRoundPage;
