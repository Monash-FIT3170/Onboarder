import * as React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

export default function RecruitmentPlatform() {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '70ch'},
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h4" component="div" sx={{ width: '100%', marginLeft:'-10px', marginTop:'-10px', backgroundColor: '#1f8ae7', color: '#fff', padding: '10px' }}>
        Onboarding: Recruitment Platform
      </Typography>
      <Typography variant="h5" component="div" marginTop="20px" marginBottom="20px" >
      <ArrowBackRoundedIcon sx={{ verticalAlign: 'middle', marginRight: '8px', marginLeft: '10px', color:'#1f8ae7', cursor:'pointer'}} />
        Opening Name
      </Typography>
      <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px'}}>
        <Typography variant='h6' component="div" sx={{ width: '50%', marginLeft: '10px' }} >
          Recruitment Round:
        </Typography>
        <Typography variant="h6" component="div" sx={{ width: '50%', marginLeft: '10px' }} >
          Applications Received:
        </Typography>
      </Box>
      <hr style={{ width: '100%', color: '#1f8ae7', opacity: '0.5', marginBottom:'15px' }} />
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom:'40px' }}>
        <Typography variant="body1" component="div" sx={{ width: '50%', marginLeft:'10px'}}>
          Monash Nova Rover Recruitment
        </Typography>
        <Typography variant="body1" component="div" sx={{ width: '50%' }}>
          2
        </Typography>
      </Box>
      <hr style={{ width: '100%', color: '#1f8ae7', opacity: '0.5', marginTop: '-25px' }} />
      <Box>
        <Typography variant="h5" component="div" marginLeft="10px">
          Applicant Info
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
          <Box sx={{ width: '50%', minWidth: '200px' }}>
            <TextField required id="first-name" label="First Name" defaultValue="John" />
          </Box>
          <Box sx={{ width: '50%' }}>
            <TextField required id="last-name" label="Last Name" defaultValue="Doe" />
          </Box>
          <Box sx={{ width: '50%' }}>
            <TextField required id="email" label="Email" defaultValue="johndoe@email.com" />
          </Box>
          <Box sx={{ width: '50%' }}>
            <TextField required id="phone-number" label="Phone Number" defaultValue="1234567890" />
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography variant="h5" component="div"marginLeft="10px">
          Course Info
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <Box sx={{ width: '50%' }}>
            <TextField required id="Course-name" label="Course Name" defaultValue="Bachelor of Engineering" />
          </Box>
          <Box sx={{ width: '50%' }}>
            <TextField required id="Specialisation" label="Specialisation" defaultValue="Mechanical Engineering" />
          </Box>
          <Box sx={{ width: '50%' }}>
            <TextField required id="Skills" label="Skills" defaultValue="..." />
          </Box>
          <Box sx={{ width: '50%' }}>
            <TextField required id="Major" label="Major" defaultValue="SE" />
          </Box>
          <Box sx={{ width: '50%' }}>
            <TextField required id="Semesters-remaining" label="Semesters Remaining" defaultValue="2" />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop:'70px' }}>
        <Button variant="contained" sx={{ m: 1, backgroundColor: '#1f8ae7' }}>
          ACCEPT
        </Button>
        <Button variant="contained" color="error" sx={{ m: 1 }}>
          REJECT
        </Button>
      </Box>
    </Box>
  );
}
