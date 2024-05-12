import { Stack, Button, Typography, TextField } from '@mui/material'

function CreateOpeningPage() {

    return (
      <Stack spacing={6} alignItems="center">

        <Stack>
          <Typography variant='h3'>Create Opening</Typography>
        </Stack>

        <Stack direction='column' spacing={12.5}>

          <Stack direction='row' spacing={20}>
            <Stack direction='row' spacing={5}>
              <Typography variant='body2' fontSize={30}>Name:</Typography>
              <TextField label='Enter Opening Name' size='small'/>
            </Stack>
            <Stack direction='row' spacing={5}>
              <Typography variant='body2' fontSize={30}>For Round:</Typography>
              <TextField label='Enter Round Name' size='small'/>
            </Stack>
          </Stack>

          <Stack direction='row' spacing={20}>
            <Stack direction='row' spacing={5}>
              <Typography variant='body2' fontSize={30}>Description:</Typography>
              <TextField label='Enter Opening Description' size='small'/>
            </Stack>
            <Stack direction='row' spacing={5}>
              <Typography variant='body2' fontSize={30}>Deadline:</Typography>
              <TextField label='Enter Deadline' size='small'/>
            </Stack>
          </Stack>

          <Stack direction='row' spacing={20}>
            <Stack direction='row' spacing={5}>
              <Typography variant='body2' fontSize={30}>Skills:</Typography>
              <TextField label='Enter Skills' size='small'/>
            </Stack>
          </Stack>

        </Stack>

        <Stack direction='row' spacing={5} alignItems="center">
            <Button variant='contained' color='primary'>Submit</Button>
            <Button variant='contained' color='warning'>Cancel</Button>
        </Stack>

      </Stack>
    )
  }
  
  export default CreateOpeningPage;
