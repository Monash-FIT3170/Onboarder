// Imported all the relevant classes
import {Button, AppBar, Toolbar, Typography, Table, TableContainer,TableBody, TableCell, TableRow, TableHead,Paper } from '@mui/material';
import React, { useState } from "react";
function ViewOpenPage() {
    // State to manage the sorting direction
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Placeholder function for handling the sort
    const handleSort = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div>
            {/* creates the top header with the blue color alongside with the Title */}
            <AppBar position="static" sx={{backgroundColor: '#007bff'}}>
                <Toolbar variant="dense">
                    <Typography variant="h5" color="inherit" component="div">
                        Onboarding: Recruitment Platform
                    </Typography>
                </Toolbar>
            </AppBar>
            {/* Creates a button below allowing the user to add positions */}
            <div style={{display: 'flex', alignItems: 'center', margin: '20px 10px'}}>
                <Button>+</Button>
                <Typography variant="h6" style={{marginLeft: '10px'}}>Events Officer</Typography>
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
            <div style={{marginTop: '50px'}}></div>

            {/* adds a table showing the number of applications for the current opening */}
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <Typography variant="h6" style={{marginLeft: '10px'}}>Opening Applications</Typography>
                        <input
                            type="text"
                            id="myInput"
                            placeholder="Search..."
                            style={{
                                width: '100%',
                                padding: '16px 20px',
                                marginBottom: '20px',
                                border: '1px solid #ccc',
                                borderRadius: '25px',
                                fontSize: '18px',
                            }}
                        />
                        <TableRow>
                            <TableCell>Student Name</TableCell>
                            <TableCell>Student Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date of Submission
                                <Button onClick={handleSort} style={{ minWidth: '30px', padding: '6px', marginLeft: '5px' }}>
                                    {sortDirection === 'asc' ? '↓' : '↑'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );
}

// transfer the page to the app
export default ViewOpenPage;
