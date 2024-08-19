import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Switch, FormControlLabel } from '@mui/material';

const TaskEmailFormatPage: React.FC = (): React.ReactNode => {
    const [taskOn, setTaskOn] = useState(true);
    const [team, setTeam] = useState('Monash Nova');
    const [recruitmentRound, setRecruitmentRound] = useState('Monash Nova Round 1');
    const [opening, setOpening] = useState('Events Officer');
    const [emailSubject, setEmailSubject] = useState(
        'Notification: You have been assigned a task for your application to Monash Nova: Events Officer'
    );
    const [emailBody, setEmailBody] = useState('Task Information');

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskOn(event.target.checked);
    };

    return(
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
            label="Team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            fullWidth
            sx={{ marginBottom: '20px' }}
        />

        <TextField
            label="Recruitment Round"
            value={recruitmentRound}
            onChange={(e) => setRecruitmentRound(e.target.value)}
            fullWidth
            sx={{ marginBottom: '20px' }}
        />

        <TextField
            label="Opening"
            value={opening}
            onChange={(e) => setOpening(e.target.value)}
            fullWidth
            sx={{ marginBottom: '20px' }}
        />

        <TextField
            label="Email Subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            fullWidth
            sx={{ marginBottom: '20px' }}
        />

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


