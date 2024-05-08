import Grid from "@mui/material/Grid"
import React from "react"
import TextField from "@mui/material/TextField"
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import { DateTime } from "luxon"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import Stack from "@mui/material/Stack"
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
        <h2 style={{ textAlign: "center" }}>Create Recruitment Round</h2>
      </main>
      <Grid container spacing={6} justifyContent="center" alignItems="center">
        <Grid item xs={3} sm={3}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Grid item>
              <h3>Round Name</h3>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} sm={3}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="flex-start"
          >
            <Grid item>
              <TextField placeholder="Enter round name" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} sm={3}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Grid item>
              <h3>Deadline</h3>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} sm={3}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="flex-start"
          >
            <Grid item>
              <LocalizationProvider
                dateAdapter={AdapterLuxon}
                adapterLocale={"en-us"}
              >
                <Stack spacing={3} sx={{ width: 300 }}>
                  <DateTimePicker
                    label="Date Picker"
                    defaultValue={DateTime.fromISO("2022-04-17T18:30")}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} sm={3}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Grid item>
              <h3>Semester</h3>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} sm={3}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="flex-start"
          >
            <Grid item>
              <Select value={"Sem1"}>
                <MenuItem value={"Sem1"}>Semester 1</MenuItem>
                <MenuItem value={"Sem2"}>Semester 2</MenuItem>
                <MenuItem value={"Summer"}>Summer Semester</MenuItem>
                <MenuItem value={"Winter"}>Winter Semester</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} sm={6}></Grid>
      </Grid>
    </div>
  )
}

export default AddRecruitmentRoundPage
