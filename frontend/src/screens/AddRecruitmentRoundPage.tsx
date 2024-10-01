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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../util/stores/authStore";
import { getBaseAPIURL } from "../util/Util";

const AddRecruitmentRoundPage = () => {
  const [application_deadline, setApplicationDeadline] = useState(DateTime.now());
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
    if (!application_deadline || !semester || !year || year.length <= 0) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        application_deadline: application_deadline.toString(),
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
        <Grid
          container
          columnSpacing={1}
          rowSpacing={6}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={2} sm={2}></Grid>
          <Grid item xs={2} sm={2}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid item>
                <h1 style={{ fontWeight: "normal" }}>Year:</h1>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2} sm={2}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid item xs={12}>
                <TextField
                  placeholder="Enter year of round"
                  fullWidth
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={1} sm={1}></Grid>
          <Grid item xs={2} sm={2}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid item>
                <h1 style={{ fontWeight: "normal" }}>Application Deadline:</h1>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2} sm={2}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid item xs={12}>
                <LocalizationProvider
                  dateAdapter={AdapterLuxon}
                  adapterLocale={"en-us"}
                >
                  <DateTimePicker
                    label="Date Picker"
                    value={application_deadline}
                    onChange={(newValue) => {
                      if (newValue) {
                        setApplicationDeadline(newValue);
                      }
                    }}
                    defaultValue={DateTime.now()}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1} sm={1}></Grid>
          <Grid item xs={2} sm={2}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid item>
                <h1 style={{ fontWeight: "normal" }}>Semester:</h1>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2} sm={2}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid item xs={12}>
                <Select
                  value={semester}
                  fullWidth
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"1"}>1</MenuItem>
                  <MenuItem value={"2"}>2</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={2} sm={2}></Grid>
          <Grid item xs={2} sm={2}></Grid>
          <Grid item xs={12} sm={12}>
            <Grid
              container
              justifyContent="center"
              alignItems="flex-end"
              minHeight={"calc(100vh - 580px)"}
            >
              <Grid item xs={4} sm={4}></Grid>
              <Grid item xs={1} sm={1}>
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
              <Grid item xs={2} sm={2}></Grid>
              <Grid item xs={1} sm={1}>
                <Link
                  to="/viewrecruitmentround"
                  style={{ textDecoration: "none" }}
                >
                  <Button variant="contained" color="error" size="large">
                    Cancel
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={4} sm={4}></Grid>
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
              setApplicationDeadline(DateTime.now()), setSemester(""), setYear("");
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
