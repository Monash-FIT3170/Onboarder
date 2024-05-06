// Imported all the relevant classes
import { AppBar, Toolbar, Typography, Grid,Divider ,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper} from '@mui/material';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function ApplicationSubmissionPage() {
  return (

    <div>

      <AppBar position="static" sx={{ backgroundColor: '#007bff' }} style={{ marginBottom: 20 }}>
        <Toolbar variant="dense">
          <Typography variant="h5" color="inherit" component="div">
            Onboarding: Recruitment Platform
          </Typography>
        </Toolbar>
      </AppBar>

     




       <Typography level="h4" style={{ marginBottom: 20 }}>Event Officer</Typography>
       <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Deadline</TableCell>
            <TableCell align="right">Student Team</TableCell>
            <TableCell align="right">Semester</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
        <TableRow>
            <TableCell>Deadline</TableCell>
            <TableCell align="right">Student Team</TableCell>
            <TableCell align="right">Semester</TableCell>
           
          </TableRow>
        
         
        </TableBody>
      </Table>
    </TableContainer>
<Typography level="h4" style={{ marginBottom: 20 }}>Applicant Information</Typography>
<Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Grid item xs={6}>
          <TextField fullWidth id="outlined-basic" label="First Name*" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth id="outlined-basic" label="Last Name" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth id="outlined-basic" label="Email" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth id="outlined-basic" label="Phone Number" variant="outlined" />
        </Grid>
      </Grid>
      
<Typography level="h4" style={{ marginBottom: 20 }}>Course Information</Typography>
<Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Grid item xs={6}>
          <TextField fullWidth id="outlined-basic" label="Course Name*" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth id="outlined-basic" label="Specalisation*" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth id="outlined-basic" label="Skills*" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth id="outlined-basic" label="Major" variant="outlined" />
        </Grid>
      </Grid>
    <Button fullWidth variant='contained'>Submit</Button>
     
    </div>
  );
}

// transfer the page to the app
export default ApplicationSubmissionPage;

