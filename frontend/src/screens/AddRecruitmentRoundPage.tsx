import Grid from "@mui/material/Grid"
import React from "react"
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
} from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import { DateTime } from "luxon"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { Label } from "@mui/icons-material"
const styles = {
  recruitmentRoundPage: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#1976d2",
    color: "#fff",
    padding: "0.25rem",
    textAlign: "left",
  },
  main: {
    padding: "2rem",
  },
  section: {
    marginBottom: "2rem",
  },
  addRoundButton: {
    marginBottom: "1rem",
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
  },
  viewButton: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
}

const AddRecruitmentRoundPage = () => {
  return (
    <div style={styles.recruitmentRoundPage}>
      <header style={styles.header}>
        <h4>Onboarding: Recruitment Platform</h4>
      </header>

      <main style={styles.main}>
        <h1 style={{ textAlign: "center" }}>Create Recruitment Round</h1>
      </main>
      <Grid
        container
        columnSpacing={1}
        rowSpacing={6}
        justifyContent="center"
        alignItems="center"
        //minHeight={'100vh'}
      >
        <Grid item xs={1} sm={1}></Grid>
        <Grid item xs={2} sm={2}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="flex-start"
          >
            <Grid item>
              <h1 style={{ fontWeight: "normal" }}>Round Name</h1>
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
              <TextField placeholder="Enter round name" fullWidth />
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
              <h1 style={{ fontWeight: "normal" }}>Deadline</h1>
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
                  defaultValue={DateTime.fromISO("2022-04-17T18:30")}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2} sm={2}></Grid>
        <Grid item xs={1} sm={1}></Grid>
        <Grid item xs={2} sm={2}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="flex-start"
          >
            <Grid item>
              <h1 style={{ fontWeight: "normal" }}>Semester</h1>
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
              <Select value={"Sem1"} fullWidth>
                <MenuItem value={"Sem1"}>Semester 1</MenuItem>
                <MenuItem value={"Sem2"}>Semester 2</MenuItem>
                <MenuItem value={"Summer"}>Summer Semester</MenuItem>
                <MenuItem value={"Winter"}>Winter Semester</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={7} sm={7}></Grid>
        <Grid item xs={12} sm={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="flex-end"
            minHeight={'calc(100vh - 560px)'}
          >
            <Grid item xs={5} sm={5}></Grid>
            <Grid item xs={1} sm={1}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                style={styles.addRoundButton}
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={1} sm={1}>
              <Button
                variant="contained"
                color="error"
                size="large"
                style={styles.addRoundButton}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={5} sm={5}></Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default AddRecruitmentRoundPage
