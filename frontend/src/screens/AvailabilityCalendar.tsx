import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { enUS } from 'date-fns/locale';

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
    // Add more events as needed
  ];
  
  const AvailabilityCalendar: React.FC = () => {
    return (
      <div style={{ height: '80vh', padding: '20px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          defaultView="week"
          views={['week', 'day']}
          selectable
          onSelectSlot={(slotInfo) => alert(`Selected slot: ${slotInfo.start.toLocaleString()} - ${slotInfo.end.toLocaleString()}`)}
          onSelectEvent={(event) => alert(`Selected event: ${event.title}`)}
        />
      </div>
    );
  };
  
  export default AvailabilityCalendar;
