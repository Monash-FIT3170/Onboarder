import React, { useState } from 'react';
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
    start: new Date(2023, 7, 20, 9, 0), // August 20, 2023, 9:00 AM
    end: new Date(2023, 7, 20, 10, 0), // August 20, 2023, 10:00 AM
  },
  {
    title: 'Available Slot',
    start: new Date(2023, 7, 21, 12, 0), // August 21, 2023, 12:00 PM
    end: new Date(2023, 7, 21, 14, 0), // August 21, 2023, 2:00 PM
  },
  {
    title: 'Interview 2',
    start: new Date(2023, 7, 22, 14, 0), // August 22, 2023, 2:00 PM
    end: new Date(2023, 7, 22, 15, 0), // August 22, 2023, 3:00 PM
  },
  // Add more events as needed
];

const AvailabilityCalendar: React.FC = () => {
  const [eventsList, setEventsList] = useState(events);

  const visibleRangeStart = new Date(2023, 7, 20); // August 20, 2023
  const visibleRangeEnd = new Date(2023, 7, 29); // August 29, 2023

  const handleSelectSlot = ({ start, end }) => {
    if (start >= visibleRangeStart && end <= visibleRangeEnd) {
      const title = prompt('Enter the title for this timeslot:');
      if (title) {
        setEventsList([...eventsList, { start, end, title }]);
      }
    } else {
      alert(`Please select a time slot within the range: August 20 - August 29, 2023.`);
    }
  };

  return (
    <div style={{ height: '80vh', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>
        Please fill in your availability for the period: August 20 - August 29, 2023
      </h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>
        You are required to fill in your availability for the interview process within the date range of August 20 to August 29, 2023. Please select your available slots by clicking on the desired time blocks in the calendar.
      </p>
      <Calendar
        localizer={localizer}
        events={eventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        defaultView="week"
        views={['week', 'day']}
        selectable
        onSelectSlot={handleSelectSlot}
        titleAccessor="title"
      />
    </div>
  );
};

export default AvailabilityCalendar;
