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