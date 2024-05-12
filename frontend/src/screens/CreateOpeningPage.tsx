import React, { useState } from 'react';
import { Stack, Button, Typography, TextField, Box, Autocomplete, Chip } from '@mui/material';

function CreateOpeningPage() {
    // State variables for form fields
    const [openingName, setOpeningName] = useState('');
    const [roundName, setRoundName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [skills, setSkills] = useState([]);  // Changed to array to support multiple skills (tags)

    // Function to handle form submission
    const handleSubmit = () => {
      alert('Opening has successfully been created!');
    };

    // Function to handle form cancellation
    const handleCancel = () => {
      setOpeningName('');
      setRoundName('');
      setDescription('');
      setDeadline('');
      setSkills([]);
      alert('Form Canceled');
    };

    return (
      <Box>
        <Box sx={{ backgroundColor: 'blue', color: 'white', padding: '15px 20px' }}>
          <Typography variant="h6">Onboarding: Recruitment Platform</Typography>
        </Box>

        <Stack spacing={6} alignItems="center" sx={{ marginTop: '20px' }}>

          <Typography variant='h3'>Create Opening</Typography>

          <Stack direction='column' spacing={12.5}>
            <Stack direction='row' spacing={20}>
              <Stack direction='row' spacing={5}>
                <Typography variant='body2' fontSize={30}>Name:</Typography>
                <TextField
                  label='Enter Opening Name'
                  size='small'
                  value={openingName}
                  onChange={(e) => setOpeningName(e.target.value)}
                />
              </Stack>
              <Stack direction='row' spacing={5}>
                <Typography variant='body2' fontSize={30}>For Round:</Typography>
                <TextField
                  label='Enter Round Name'
                  size='small'
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                />
              </Stack>
            </Stack>

            <Stack direction='row' spacing={20}>
              <Stack direction='row' spacing={5}>
                <Typography variant='body2' fontSize={30}>Description:</Typography>
                <TextField
                  label='Enter Opening Description'
                  size='small'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Stack>
              <Stack direction='row' spacing={5}>
                <Typography variant='body2' fontSize={30}>Deadline:</Typography>
                <TextField
                  label='Enter Deadline'
                  size='small'
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </Stack>
            </Stack>

            <Stack direction='row' spacing={20}>
              <Stack direction='row' spacing={5}>
                <Typography variant='body2' fontSize={30}>Skills:</Typography>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]} // Provide predefined options here if needed
                  value={skills}
                  onChange={(event, newValue) => {
                    setSkills(newValue);
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip key={index} label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Skills"
                      placeholder="Add skills"
                      sx={{ width: 300 }}
                    />
                  )}
                />
              </Stack>
            </Stack>
          </Stack>

          <Stack direction='row' spacing={5} alignItems="center">
            <Button variant='contained' color='primary' onClick={handleSubmit}>Submit</Button>
            <Button variant='contained' color='warning' onClick={handleCancel}>Cancel</Button>
          </Stack>
        </Stack>
      </Box>
    );
}

export default CreateOpeningPage;
