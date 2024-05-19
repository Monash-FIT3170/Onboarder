import Grid from "@mui/material/Grid"
import React, { useState } from "react"
import {
  Select,
  MenuItem,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import { DateTime } from "luxon"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import axios from "axios"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const styles = {
  recruitmentRoundPage: {
    fontFamily: "Arial, sans-serif",
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
  const [deadline, setDeadline] = useState(DateTime.now())
  const [semester, setSemester] = useState("")
  const [year, setYear] = useState("")
  const [open, setOpen] = useState(false)
  const [dialogParam, setDialogParam] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (event: any) => {
    event.preventDefault()
    if (!deadline || !semester || !year || year.length <= 0) {
      alert("Please fill in all fields")
      return
    }
    axios
      .post("http://127.0.0.1:3000/recruitmentRounds", {
        deadline: deadline.toString(),
        semester: semester,
        year: year,
        status: "I",
      })
      .then((response) => {
        console.log(response)
        setOpen(true)
        setDialogParam(true)
      })
      .catch((error) => {
        console.error("There was an error!", error)
        setOpen(true)
        setDialogParam(false)
      })
  }
  return (
    <div style={styles.recruitmentRoundPage}>
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
                <h1 style={{ fontWeight: "normal" }}>Deadline:</h1>
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
                    value={deadline}
                    onChange={(newValue) => {
                      if (newValue) {
                        setDeadline(newValue)
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
                  style={styles.addRoundButton}
                  type="submit"
                >
                  Submit
                </Button>
              </Grid>
              <Grid item xs={2} sm={2}></Grid>
              <Grid item xs={1} sm={1}>
                <Link
                  to="/viewrecruitmentround"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    style={styles.addRoundButton}
                  >
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
              setOpen(false)
              navigate("/viewrecruitmentround")
            }}
          >
            GO TO ROUNDS TABLE
          </Button>
          <Button
            onClick={() => {
              setOpen(false)
              setDeadline(DateTime.now()), setSemester(""), setYear("")
            }}
          >
            CREATE MORE ROUNDS
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AddRecruitmentRoundPage
