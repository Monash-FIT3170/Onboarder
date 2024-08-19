import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Switch, FormControlLabel } from '@mui/material';

const TaskEmailFormatPage: React.FC = (): React.ReactNode => {
    const [taskOn, setTaskOn] = useState(true);
    const [team] = useState('Monash Nova');
    const [recruitmentRound] = useState('Monash Nova Round 1');
    const [opening] = useState('Events Officer');
    const [emailBody, setEmailBody] = useState('Task Information');

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskOn(event.target.checked);
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                Task Configuration
            </Typography>
            
            <FormControlLabel
                control={<Switch checked={taskOn} onChange={handleToggle} />}
                label="Task On?"
                sx={{ marginBottom: '20px', float: 'right' }}
            />

            <TextField
                label="Task Details"
                value={`${team} - ${recruitmentRound} - ${opening}`}
                fullWidth
                sx={{ marginBottom: '20px' }}
                InputProps={{
                    readOnly: true,
                }}
            />

            <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                Email Format
            </Typography>

            <TextField
                label="Email Body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                fullWidth
                multiline
                rows={4}
                sx={{ marginBottom: '20px' }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" color="primary">
                    Confirm
                </Button>
                <Button variant="outlined" color="secondary">
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default TaskEmailFormatPage;
