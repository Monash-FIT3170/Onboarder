import React, { useState } from "react"
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
} from "@mui/material"
import { formatDeadline } from "../util/Util"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"

function CreateOpeningPage() {
  const [openingName, setOpeningName] = useState("")
  const [description, setDescription] = useState("")
  const [requiredSkills, setRequiredSkills] = useState([])
  const [desiredSkills, setDesiredSkills] = useState([])
  const [open, setOpen] = useState(false)
  const [dialogParam, setDialogParam] = useState(false)
  const navigate = useNavigate()

  const location = useLocation()
  const state = location.state as {
    deadline: string
    roundId: number
    round: string
  }

  // const handleSubmit = () => {
  //     alert('Opening has successfully been created!');
  // };

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
      alert("Please fill in all fields")
      return
    }
    const openingData = {
      title: openingName,
      description: description,
      status: "I",
      required_skills: requiredSkills,
      desired_skills: desiredSkills,
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:3000/recruitmentRounds/${state.roundId}/openings`,
        openingData
      )
      if (response.status === 201) {
        //alert("Opening successfully been created!");
        setOpen(true)
        setDialogParam(true)
      } else {
        //alert("Failed to create opening.");
        setOpen(true)
        setDialogParam(true)
      }
    } catch (error) {
      console.error("Error creating the opening!", error)
      alert("Error creating the opening!")
    }
  }

  const handleCancel = () => {
    navigate("/recruitment-details-page", {
      state: {
        recruitment_round_id: state.roundId,
      },
    })
    //navigate("/recruitment-details-page/"+state.roundId)
  }

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h3" textAlign="center">
          Create Opening
        </Typography>
      </Grid>

      <Grid item xs={6} container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body2" fontSize={30}>
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
        <Grid item xs={12}>
          <Typography variant="body2" fontSize={30}>
            For Round: {state.round}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" fontSize={30}>
            Required Skills:
          </Typography>
          <Autocomplete
            fullWidth
            multiple
            freeSolo
            options={[]}
            value={requiredSkills}
            onChange={(event, newValue) => {
              setRequiredSkills(newValue)
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={index} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Add skills" sx={{ width: "50%" }} />
            )}
          />
        </Grid>
      </Grid>

      <Grid item xs={6} container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body2" fontSize={30}>
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
        <Grid item xs={12}>
          <Typography variant="body2" fontSize={30}>
            Deadline: {formatDeadline(state.deadline)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" fontSize={30}>
            Desired Skills:
          </Typography>
          <Autocomplete
            fullWidth
            multiple
            freeSolo
            options={[]}
            value={desiredSkills}
            onChange={(event, newValue) => {
              setDesiredSkills(newValue)
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={index} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Add skills" sx={{ width: "50%" }} />
            )}
          />
        </Grid>
      </Grid>

      <Grid item container xs={12} justifyContent="center" spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
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
              ? "Opening successfully been created!"
              : "There was an error in creating the Opening!\n Please try again later!"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false)
              navigate("/recruitment-details-page", {
                state: {
                  recruitment_round_id: state.roundId,
                },
              })
            }}
          >
            GO TO OPENINGS TABLE
          </Button>
          <Button
            onClick={() => {
              setOpen(false)
              setOpeningName(""),
                setDescription(""),
                setDesiredSkills([]),
                setRequiredSkills([])
            }}
          >
            CREATE MORE OPENINGS
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CreateOpeningPage
