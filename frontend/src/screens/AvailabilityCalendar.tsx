import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { DndProvider } from 'react-dnd'; // Provides the drag-and-drop context for the calendar
import { HTML5Backend } from 'react-dnd-html5-backend'; // HTML5 backend for react-dnd, handles drag-and-drop interactions
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'; // Higher-order component to enable drag-and-drop on the calendar
import format from 'date-fns/format'; // Utility for formatting dates
import parse from 'date-fns/parse'; // Utility for parsing dates
import startOfWeek from 'date-fns/startOfWeek'; // Utility for determining the start of the week
import getDay from 'date-fns/getDay'; // Utility for getting the day of the week
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import base styles for the calendar
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'; // Import additional styles for drag-and-drop functionality
import { enUS } from 'date-fns/locale'; 

// Locale configuration for the calendar using date-fns
const locales = { 'en-US': enUS };

// Setup the localizer to use date-fns for formatting and parsing dates
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Enhance the Calendar component with drag-and-drop functionality
const DragAndDropCalendar = withDragAndDrop(Calendar);

// Initial set of events to be displayed in the calendar
const initialEvents = [
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
];

const AvailabilityCalendar: React.FC = () => {
  // State to manage the list of events
  const [eventsList, setEventsList] = useState(initialEvents);

  // Function to handle the selection of a new time slot in the calendar
  const handleSelectSlot = ({ start, end }) => {
    // Check if the selected time slot overlaps with any existing events
    const overlappingEvent = eventsList.find(
      (event) => start < event.end && end > event.start
    );

    // If there is an overlap, alert the user; otherwise, add the new event
    if (overlappingEvent) {
      alert('The selected time slot overlaps with an existing event. Please choose a different time.');
    } else {
      setEventsList([...eventsList, { start, end, title: 'Available Slot' }]);
    }
  };

  // Function to handle resizing of existing events
  const handleEventResize = ({ event, start, end }) => {
    // Update the event's start and end times
    setEventsList(
      eventsList.map((existingEvent) =>
        existingEvent === event ? { ...existingEvent, start, end } : existingEvent
      )
    );
  };

  // Function to handle dragging (moving) existing events to a new time slot
  const handleEventDrop = ({ event, start, end }) => {
    // Update the event's start and end times after being moved
    setEventsList(
      eventsList.map((existingEvent) =>
        existingEvent === event ? { ...existingEvent, start, end } : existingEvent
      )
    );
  };

  return (
    // DndProvider wraps the calendar component to provide drag-and-drop functionality
    <DndProvider backend={HTML5Backend}>
      <div style={{ height: '80vh', padding: '20px' }}>
        <h2 style={{ textAlign: 'center', margin: '20px 0' }}>
          Please fill in your availability for the period: August 20 - August 29, 2023
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          You are required to fill in your availability for the interview process within the date range of August 20 to August 29, 2023. Please select your available slots by clicking on the desired time blocks in the calendar.
        </p>
        <DragAndDropCalendar
          localizer={localizer} 
          events={eventsList} 
          startAccessor={(event) => event.start} // Specify how to access the start date of an event
          endAccessor={(event) => event.end} // Specify how to access the end date of an event
          style={{ height: '100%' }} 
          defaultView="week" 
          views={['week', 'day']} 
          selectable // Allow users to select time slots to create new events
          resizable // Enable resizing of existing events
          onSelectSlot={handleSelectSlot} // Handle new slot selection
          onEventResize={handleEventResize} // Handle resizing of existing events
          onEventDrop={handleEventDrop} // Handle dragging (moving) of existing events
          titleAccessor={(event) => event.title} // Specify how to access the title of an event
        />
      </div>
    </DndProvider>
  );
};

export default AvailabilityCalendar;
