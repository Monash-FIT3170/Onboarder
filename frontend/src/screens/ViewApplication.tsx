import * as React from 'react';
import { Grid, TextField, Button, Typography, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

export default function RecruitmentPlatform() {
  return (
    <>
      <Typography variant="h4" component="div" sx={{ width: '100%', marginLeft: '-10px', marginTop: '-10px', backgroundColor: '#1f8ae7', color: '#fff', padding: '10px' }}>
        Onboarding: Recruitment Platform
      </Typography>
      <Typography variant="h5" component="div" sx={{ width: '50%',marginTop:'30px' }}>
        Opening Name
      </Typography>
      <TableContainer component={Paper} sx={{marginTop:'20px'}}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Student team</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                Monash Nova Rover
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Grid item xs={12}>
        <Typography variant="h5" component="div" sx={{ marginLeft: '10px', marginBottom: '20px', marginTop: '20px' }}>
          Applicant Info
        </Typography>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <TextField required id="first-name" label="First Name" defaultValue="John" InputProps={{ readOnly: true }} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField required id="last-name" label="Last Name" defaultValue="Doe" InputProps={{ readOnly: true }} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField required id="email" label="Email" defaultValue="johndoe@email.com" InputProps={{ readOnly: true }} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField required id="phone-number" label="Phone Number" defaultValue="1234567890" InputProps={{ readOnly: true }} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField id="Additional-information" label="Additional Information" defaultValue="I am perfect for this role as ..." InputProps={{ readOnly: true }} fullWidth />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" component="div" sx={{ marginLeft: '10px', marginBottom: '20px', marginTop: '20px' }}>
          Course Info
        </Typography>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <TextField required id="Course-name" label="Course Name" defaultValue="Bachelor of Engineering" InputProps={{ readOnly: true }} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField required id="Specialisation" label="Major" defaultValue="Mechanical Engineering" InputProps={{ readOnly: true }} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField required id="Skills" label="Skills" defaultValue="CAD, Programming" InputProps={{ readOnly: true }} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField required id="Semesters remaining" label="Semesters Remaining" defaultValue="2" InputProps={{ readOnly: true }} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth required id="Current semester" label="Current Remaining" defaultValue="2" InputProps={{ readOnly: true }} />
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop: '70px' }}>
        <Button variant="contained" sx={{ m: 1, backgroundColor: '#1f8ae7' }}>
          ACCEPT
        </Button>
        <Button variant="contained" color="error" sx={{ m: 1 }}>
          REJECT
        </Button>
      </Grid>
    </>
  );
}
