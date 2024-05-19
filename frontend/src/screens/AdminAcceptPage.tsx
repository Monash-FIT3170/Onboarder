import {React,useState,useEffect} from 'react';
import { Grid, TextField, Button, Typography, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import LoadingSpinner from "../components/LoadSpinner";
interface ResultProps {
    id: number;
    opening_id: number; // assuming deadline is a date in string format
    email: string;
    name: string;
    phone: string;
    semesters_until_completion: number;
    current_semester: number;
    course_enrolled: string;
    major_enrolled: string;
    cover_letter: string;
    skills: string[];
    accepted: string;
    created_at: number;
  }

export default function RecruitmentPlatform() {
  const [applicantInformation, setApplicantInformation] = useState<ResultProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/applications/1');
        setApplicantInformation(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching applicant data:', error);
      }finally {
        setLoading(false);
      }
    };
    

    fetchData();
  }, []);
 
  
  if (loading) {
    return <LoadingSpinner />;}
  return (
    <>


      {/* <Typography variant="h4" component="div" sx={{ width: '100%', marginLeft: '-10px', marginTop: '-10px', backgroundColor: '#1f8ae7', color: '#fff', padding: '10px' }}>
        Onboarding: Recruitment Platform
      </Typography> */}
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

      <Grid item xs={12} >
        <Typography variant="h5" component="div" sx={{ marginLeft: '10px', marginBottom: '20px', marginTop: '20px' }}>
          Applicant Info
        </Typography>
      </Grid>
      <Grid container item xs={12} spacing={2} >
        <Grid item xs={6}>
          <TextField  disabled={true} required id="first-name" label="First Name" defaultValue={`${applicantInformation[0]?.name}`} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField required id="last-name" label="Last Name" defaultValue={`${applicantInformation[0]?.name}`} fullWidth disabled={true} />
        </Grid>
        <Grid item xs={6}>
          <TextField required id="email" label="Email" defaultValue={`${applicantInformation[0]?.email}`} disabled={true} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField required id="phone-number" label="Phone Number" defaultValue={`${applicantInformation[0]?.phone}`} disabled={true} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField id="Additional-information" label="Additional Information" defaultValue={`${applicantInformation[0]?.cover_letter}`} disabled={true} fullWidth />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" component="div" sx={{ marginLeft: '10px', marginBottom: '20px', marginTop: '20px' }}>
          Course Info
        </Typography>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <TextField required id="Course-name" label="Course Name" defaultValue={`${applicantInformation[0]?.course_enrolled}`} disabled={true} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField required id="Specialisation" label="Major" defaultValue={`${applicantInformation[0]?.major_enrolled}`} disabled={true} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField required id="Skills" label="Skills" defaultValue={`${applicantInformation[0]?.skills}`} disabled={true} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField required id="Semesters remaining" label="Semesters Remaining" defaultValue={`${applicantInformation[0]?.semesters_until_completion}`} disabled={true} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth required id="Current semester" label="Current Remaining" defaultValue={`${applicantInformation[0]?.current_semester}`} disabled={true} />
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
