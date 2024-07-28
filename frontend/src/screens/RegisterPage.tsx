import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Grid,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';

const FlexContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    maxWidth: '50%',
  },
}));

const ImageSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f0f8ff', // Light blue background
  [theme.breakpoints.down('md')]: {
    minHeight: '300px',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '400px',
  width: '100%',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  studentTeam: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    studentTeam: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <FlexContainer>
      <FormSection>
        <StyledPaper elevation={0}>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Monash Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="studentTeam"
                label="Student Team"
                name="studentTeam"
                value={formData.studentTeam}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            CREATE ACCOUNT
          </SubmitButton>
          
        </form>
        </StyledPaper>
      </FormSection>
      <ImageSection>
        <img
          src="/path/to/your/login-image.png"
          alt="Login illustration"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </ImageSection>
    </FlexContainer>
  );
};

export default RegisterPage;