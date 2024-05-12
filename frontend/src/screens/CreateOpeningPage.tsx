import { Stack, Button, Typography, TextField } from '@mui/material'
import { useState } from 'react';

function CreateOpeningPage() {
    // State variables for form fields
    const [openingName, setOpeningName] = useState('');
    const [roundName, setRoundName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [skills, setSkills] = useState('');

    // Function to handle form submission
    const handleSubmit = () => {
      alert('Placeholder submit')
    };

    // Function to handle form cancellation
    const handleCancel = () => {
      // Reset form fields
      setOpeningName('');
      setRoundName('');
      setDescription('');
      setDeadline('');
      setSkills('');

      alert('Placeholder cancel')
    };

    return (
      <Stack spacing={6} alignItems="center">

        <Stack>
          <Typography variant='h3'>Create Opening</Typography>
        </Stack>

        <Stack direction='column' spacing={12.5}>

          <Stack direction='row' spacing={20}>
            <Stack direction='row' spacing={5}>
              <Typography variant='body2' fontSize={30}>Name:</Typography>
              <TextField
              label='Enter Opening Name'
              size='small'
              value={openingName}
              />
            </Stack>
            <Stack direction='row' spacing={5}>
              <Typography variant='body2' fontSize={30}>For Round:</Typography>
              <TextField
              label='Enter Round Name'
              size='small'
              value={roundName}
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
              />
            </Stack>
            <Stack direction='row' spacing={5}>
              <Typography variant='body2' fontSize={30}>Deadline:</Typography>
              <TextField
              label='Enter Deadline'
              size='small'
              value={deadline}
              />
            </Stack>
          </Stack>

          <Stack direction='row' spacing={20}>
            <Stack direction='row' spacing={5}>
              <Typography variant='body2' fontSize={30}>Skills:</Typography>
              <TextField
              label='Enter Skills'
              size='small'
              value={skills}
              />
            </Stack>
          </Stack>

        </Stack>

        <Stack direction='row' spacing={5} alignItems="center">
            <Button variant='contained' color='primary' onClick={handleSubmit}>Submit</Button>
            <Button variant='contained' color='warning' onClick={handleCancel}>Cancel</Button>
        </Stack>

      </Stack>
    )
  }
  
  export default CreateOpeningPage;
