import React from 'react';
import { TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Container, Typography, Paper } from '@material-ui/core';
import axios from 'axios';

const OnboardingForm = () => {
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('Owner');

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const validateEmail = (email: string) => {
    // Simple regex for basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    // Validate the email format
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    // Prepare the data to send
    const invitationData = {
      email,
      role,
    };
  
    try {
      // Make an API call to send the invitation
      const response = await axios.post('/api/invite-team-members', invitationData);
      
      // Log the response
      console.log(response);
  
      if (response.status === 200) {
        alert("Invitation sent successfully to " + email + "!");
      } else {
        alert("Failed to send invitation.");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("There was an error sending the invitation.");
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#3f51b5' }}>
          Onboarding: Recruitment Platform
        </Typography>
        <Typography variant="h6" gutterBottom>
          Invite Member
        </Typography>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            placeholder="doe0001@student.monash.edu"
            value={email}
            onChange={handleEmailChange}
          />
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Role</FormLabel>
            <RadioGroup value={role} onChange={handleRoleChange}>
              <FormControlLabel value="Owner" control={<Radio />} label="Owner" />
              <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
              <FormControlLabel value="Team Lead" control={<Radio />} label="Team Lead" />
            </RadioGroup>
          </FormControl>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Button
              variant="contained"
              color="primary"
              style={{ backgroundColor: '#2478d7', color: 'white' }}
              type="submit"
            >
              SEND INVITATION
            </Button>
            <Button variant="contained" style={{ backgroundColor: 'gray', color: 'white' }}>
              CANCEL
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
};

export default OnboardingForm;
