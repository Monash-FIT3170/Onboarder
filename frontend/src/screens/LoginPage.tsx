import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
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

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle login logic here
    console.log({ email, password, rememberMe });
  };

  return (
    <FlexContainer>
      <FormSection>
        <StyledForm onSubmit={handleSubmit}>
          <Typography component="h1" variant="h5" gutterBottom>
            Log In
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Don't have an account? <Link href="/register">Create one!</Link>
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link href="#" variant="body2">
            Forgot password?
          </Link>
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remember me"
          />
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            LOG IN
          </SubmitButton>
        </StyledForm>
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

export default LoginPage;