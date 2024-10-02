import Grid from "@mui/material/Grid";
import { useState } from "react";
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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../util/stores/authStore";
import { getBaseAPIURL } from "../util/Util";
// const TitleWrap = styled.div`
//   margin: auto;
//   text-align: center;
// `;
const AddRecruitmentRoundPage = () => {
  const [application_deadline, setApplicationDeadline] = useState(
    DateTime.now(),
  );
  const [interviewPreferenceDeadline, setInterviewPreferenceDeadline] =
    useState(DateTime.now());
  const [interviewPeriod, setInterviewPeriod] = useState([
    DateTime.now(),
    DateTime.now(),
  ]);
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [open, setOpen] = useState(false);
  const [dialogParam, setIsSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const authStore = useAuthStore();
  const studentTeamId = authStore.team_id;
  const BASE_API_URL = getBaseAPIURL();
  const API_URL = `${BASE_API_URL}/student-team/${studentTeamId}/recruitment-round/`; // Working

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (
      !application_deadline ||
      !semester ||
      !year ||
      year.length <= 0 ||
      !interviewPreferenceDeadline ||
      !interviewPeriod
    ) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        application_deadline: application_deadline.toString(),
        interview_preference_deadline: interviewPreferenceDeadline.toString(),
        interview_period: interviewPeriod.map((date) => date?.toString()),
        semester: semester,
        year: year,
        status: "I",
      });
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

  return (
    <div>
      <main>
        <h1 style={{ textAlign: "center", fontSize: "4em", fontWeight: "100" }}>
          Create Recruitment Round
        </h1>
      </main>
      <form onSubmit={handleSubmit}>
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Team</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>w</TableCell>
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
                  if (newValue) setApplicationDeadline(newValue);
                }}
                defaultValue={DateTime.now()}
                slotProps={{ textField: { fullWidth: true } }}
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
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </Select>
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
                value={interviewPreferenceDeadline}
                onChange={(newValue) => {
                  if (newValue) setInterviewPreferenceDeadline(newValue);
                }}
                defaultValue={DateTime.now()}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontSize={20}>
              Interview Period:
            </Typography>
            <LocalizationProvider
              dateAdapter={AdapterLuxon}
              adapterLocale="en-us"
            >
              <DateTimePicker
                label="Start Date"
                value={interviewPeriod[0]}
                onChange={(newValue) => {
                  if (newValue)
                    setInterviewPeriod([newValue, interviewPeriod[1]]);
                }}
                defaultValue={DateTime.now()}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <DateTimePicker
                label="End Date"
                value={interviewPeriod[1]}
                onChange={(newValue) => {
                  if (newValue)
                    setInterviewPeriod([interviewPeriod[0], newValue]);
                }}
                defaultValue={DateTime.now()}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item container xs={12} justifyContent="center" spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Grid>
            <Grid item>
              <Link
                to="/viewrecruitmentround"
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
              navigate("/viewrecruitmentround");
            }}
          >
            GO TO ROUNDS TABLE
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              setApplicationDeadline(DateTime.now()),
                setSemester(""),
                setYear("");
            }}
          >
            CREATE MORE ROUNDS
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddRecruitmentRoundPage;
