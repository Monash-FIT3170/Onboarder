// Imported all the relevant classes
import {Button, AppBar, Toolbar, Typography, Table, TableContainer,TableBody, TableCell, TableRow, TableHead,Paper } from '@mui/material';


function ViewOpenPage() {
  return (
    <div>
      {/* creates the top header with the blue color alongside with the Title */}
      <AppBar position="static" sx={{ backgroundColor: '#007bff' }}>
        <Toolbar variant="dense">
          <Typography variant="h5" color="inherit" component="div">
            Onboarding: Recruitment Platform
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Creates a button below allowing the user to add positions */}
      <div style={{ display: 'flex', alignItems: 'center', margin:'20px 10px'}}>
        <Button >+</Button>
        <Typography variant="h6" style={{ marginLeft: '10px' }}>Events Officer</Typography>
      </div>
      {/* creates a table showing all the number of applications for each recuritment round */}
      <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Recruitment Round</TableCell>
            <TableCell>Applications Received for Opening </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            
        </TableBody>
      </Table>
    </TableContainer>

    </div>
  );
}
// transfer the page to the app
export default ViewOpenPage;
