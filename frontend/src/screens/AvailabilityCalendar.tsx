import React, { useRef } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { enUS } from 'date-fns/locale';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { ArrowBack, Today, ArrowForward } from '@mui/icons-material';
import CalendarPicker from '@mui/lab/CalendarPicker';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: 'Interview 1',
    start: new Date(2023, 11, 12, 9, 0), // Dec 12, 2023, 9:00 AM
    end: new Date(2023, 11, 12, 10, 0), // Dec 12, 2023, 10:00 AM
  },
  {
    title: 'Available Slot',
    start: new Date(2023, 11, 12, 12, 0), // Dec 12, 2023, 12:00 PM
    end: new Date(2023, 11, 12, 14, 0), // Dec 12, 2023, 2:00 PM
  },
  {
    title: 'Interview 2',
    start: new Date(2023, 11, 14, 14, 0), // Dec 14, 2023, 2:00 PM
    end: new Date(2023, 11, 14, 15, 0), // Dec 14, 2023, 3:00 PM
  },
];

const AvailabilityCalendar: React.FC = () => {
  const calendarRef = useRef<any>(null);

  const goToBack = () => {
    const { current } = calendarRef;
    current?.navigate('PREV');
  };

  const goToNext = () => {
    const { current } = calendarRef;
    current?.navigate('NEXT');
  };

  const goToToday = () => {
    const { current } = calendarRef;
    current?.navigate('TODAY');
  };

  return (
    <div>
      {/* Header with title and navigation */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={goToBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Availabilities
          </Typography>
          <IconButton color="inherit" aria-label="today" onClick={goToToday}>
            <Today />
          </IconButton>
          <IconButton edge="end" color="inherit" aria-label="next" onClick={goToNext}>
            <ArrowForward />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main content with sidebar and calendar */}
      <Box display="flex">
        {/* Sidebar with date picker */}
        <Box padding={2}>
          <CalendarPicker date={new Date()} onChange={(date) => console.log(date)} />
        </Box>

        {/* Calendar */}
        <Box flexGrow={1} padding={2}>
          <Calendar
            ref={calendarRef}
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '80vh' }}
            defaultView="week"
            views={['week', 'day']}
            selectable
            eventPropGetter={(event) => {
              const backgroundColor = event.title.includes('Interview') ? '#7e57c2' : '#42a5f5';
              return { style: { backgroundColor } };
            }}
            onSelectSlot={(slotInfo) => alert(`Selected slot: ${slotInfo.start.toLocaleString()} - ${slotInfo.end.toLocaleString()}`)}
            onSelectEvent={(event) => alert(`Selected event: ${event.title}`)}
          />
        </Box>
      </Box>
    </div>
  );
};

export default AvailabilityCalendar;
