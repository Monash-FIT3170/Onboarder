import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Chip } from '@mui/material';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';

export default () => {
  const [studentTeam, setStudentTeam] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    additionalInformation: '',
    courseName: '',
    major: '',
    skills: [],
    currentSemester: '',
    semesterRemaining: ''
  });
  // Define skills state
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/recruitmentRounds/1/openings/1")
      .then(res => {
        setStudentTeam(res.data);
      })
      .catch(err => {
        console.error("Error fetching student team data:", err);
      });
  }, []);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = () => {
    // Check if any of the required fields are empty
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'courseName', 'skills'];
    const isAnyFieldEmpty = requiredFields.some(field => {
      if (Array.isArray(formData[field])) {
        return formData[field].length === 0;
      }
      return !formData[field];
    });

    if (isAnyFieldEmpty) {
      alert('Please fill in all required fields.');
    } else {
      
      // axios.post('https://example.com/api', formData)
      //   .then(response => {
      //     console.log('Form data successfully submitted:', response.data);
      //   })
      //   .catch(error => {
      //     console.error('Error submitting form data:', error);
      //   });
    }
  };

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: '#007bff' }} style={{ marginBottom: 20 }}>
        <Toolbar variant="dense">
          <Typography variant="h5" color="inherit" component="div">
            Onboarding: Recruitment Platform
          </Typography>
        </Toolbar>
      </AppBar>

      {studentTeam.map((row, index) => (
        <div key={index}>
          <Typography variant="h5" color="inherit" component="div">
            {row.title}
          </Typography>
          <Typography variant="body1" color="inherit" component="div">
            Description: {row.description}
          </Typography>
        </div>
      ))}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Deadline</TableCell>
              <TableCell align="center">Student Team</TableCell>
              <TableCell align="center">Semester</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentTeam.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(row.deadline).toLocaleDateString('en-GB')}</TableCell>
                <TableCell align="center">{row.student_team_name}</TableCell>
                <TableCell align="center">Semester {row.recruitment_round_semester}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" color="inherit" component="div">
        Application Information
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Grid item xs={6}>
          <TextField fullWidth id="firstName" label="First Name*" variant="outlined" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth id="lastName" label="Last Name*" variant="outlined" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth id="email" label="Email*" variant="outlined" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth id="phoneNumber" label="Phone Number*" variant="outlined" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth id="additionalInformation" label="Additional Information" variant="outlined" onChange={handleInputChange} />
        </Grid>
      </Grid>

      <Typography variant="h5" color="inherit" component="div">
        Course Information
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Grid item xs={6}>
          <TextField fullWidth id="courseName" label="Course Name*" variant="outlined" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth id="major" label="Major" variant="outlined" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            multiple
            freeSolo
            options={[]}
            value={formData.skills} // Use formData.skills
            onChange={(event, newValue) => {
              setFormData({ ...formData, skills: newValue }); // Update formData
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={index} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add skills"
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth id="currentSemester" label="Current Semester" variant="outlined" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth id="semesterRemaining" label="Semesters Remaining" variant="outlined" onChange={handleInputChange} />
        </Grid>
      </Grid>

      <Button fullWidth variant='contained' onClick={handleSubmit}>Submit</Button>

    </div>
  );
}
