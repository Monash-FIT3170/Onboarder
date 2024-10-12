import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { DndProvider } from "react-dnd"; // Provides the drag-and-drop context for the calendar
import { HTML5Backend } from "react-dnd-html5-backend"; // HTML5 backend for react-dnd, handles drag-and-drop interactions
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"; // Higher-order component to enable drag-and-drop on the calendar
import format from "date-fns/format"; // Utility for formatting dates
import parse from "date-fns/parse"; // Utility for parsing dates
import startOfWeek from "date-fns/startOfWeek"; // Utility for determining the start of the week
import getDay from "date-fns/getDay"; // Utility for getting the day of the week
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import base styles for the calendar
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"; // Import additional styles for drag-and-drop functionality
import { enAU } from "date-fns/locale";
import { Button, Grid, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../util/stores/authStore";
import axios from "axios";
import { getBaseAPIURL } from "../util/Util";

// Locale configuration for the calendar using date-fns
const locales = { "en-AU": enAU };

// Setup the localizer to use date-fns for formatting and parsing dates
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Event {
  start: Date;
  end: Date;
  title: string;
}

// Enhance the Calendar component with drag-and-drop functionality
const DragAndDropCalendar = withDragAndDrop(Calendar);

const AvailabilityCalendarUser: React.FC = () => {
  // State hooks
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [interviewDates, setInterviewDates] = useState<Event[]>([]);

  // Constants
  const navigate = useNavigate();
  const scrollToTime = new Date();
  const BASE_API_URL = getBaseAPIURL();

  // Store hooks
  const { profile: profileId, fetchProfile } = useAuthStore();

  // Effect hooks
  const fetchAvailability = async () => {
    let profileID = profileId;

    if (!profileId) {
      profileID = await fetchProfile();
    }

    const response = await axios.get(`${BASE_API_URL}/profile/${profileID}`);
    const data = response.data;

    const parsedData = data[0].interview_availability.map((event: Event) => {
      const parsedEvent = JSON.parse(event as unknown as string);

      return {
        ...parsedEvent,
        start: new Date(parsedEvent.start),
        end: new Date(parsedEvent.end),
      };
    });

    setEventsList(parsedData);
  };

  // Get interview dates from applications where profile_id is authenticated user
  const fetchScheduledInterviews = async () => {
    const response = await axios.get(
      `${BASE_API_URL}/profile/${profileId}/application`,
    );
    const data = response.data;
    console.log(data);
    const interviewDates = data.map((interview: any) => {
      return {
        start: new Date(interview.interview_date),
        end: new Date(
          new Date(interview.interview_date).setMinutes(
            new Date(interview.interview_date).getMinutes() + 30,
          ),
        ),
        title: "Interview with " + interview.name,
        editable: false,
        outlined: true,
      };
    });
    setInterviewDates(interviewDates);
  };

  useEffect(() => {
    fetchAvailability();
    fetchScheduledInterviews();
  }, []);

  // Handler functions
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // Check if the selected time slot overlaps with any existing events
    const overlappingEvent = eventsList.find(
      (event) => start < event.end && end > event.start,
    );

    // If there is an overlap, alert the user; otherwise, add the new event
    if (overlappingEvent) {
      alert(
        "The selected time slot overlaps with an existing event. Please adjust the existing event or select a different time slot.",
      );
    } else {
      const updatedEvents = [
        ...eventsList,
        { start, end, title: "Available Slot" },
      ];
      setEventsList(updatedEvents);
      console.log("Updated Events");
      console.log(updatedEvents);
      console.log("Interview Dates");
      console.log(interviewDates);
    }
  };

  const handleSelectEvent = ({ start, end }: { start: Date; end: Date }) => {
    setEventsList(
      eventsList.filter((event) => event.start != start && event.end != end),
    );
  };

  const handleEventResize = ({
    event,
    start,
    end,
  }: {
    event: Event;
    start: Date;
    end: Date;
  }) => {
    const updatedEvents = eventsList.map((existingEvent) =>
      existingEvent === event
        ? { ...existingEvent, start, end }
        : existingEvent,
    );
    setEventsList(updatedEvents);
  };

  const handleEventDrop = ({
    event,
    start,
    end,
  }: {
    event: Event;
    start: Date;
    end: Date;
  }) => {
    const updatedEvents = eventsList.map((existingEvent) =>
      existingEvent === event
        ? { ...existingEvent, start, end }
        : existingEvent,
    );
    setEventsList(updatedEvents);
  };

  const handleSave = async () => {
    // console.log(eventsList);
    try {
      await axios.patch(`${BASE_API_URL}/profile/${profileId}`, {
        interview_availability: eventsList.filter(
          (event) => event.title === "Available Slot",
        ),
      });
    } catch (error) {
      console.error(`Error saving availability data: ${error}`);
    } finally {
      alert("Availability saved successfully!");
    }
  };

  // Calendar configuration
  scrollToTime.setHours(9, 0, 0);

  const eventStyleGetter = (event) => {
    if (event.outlined) {
      return {
        className: "outlined",
        style: {
          opacity: event.editable ? 1 : 0.7,
        },
      };
    }
    // For non-outlined events, return an empty object to use default styles
    return {};
  };

  return (
    // DndProvider wraps the calendar component to provide drag-and-drop functionality
    <DndProvider backend={HTML5Backend}>
      <div style={{ height: "75vh", padding: "20px", paddingTop: "0" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <IconButton onClick={() => navigate("/dashboard")} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <h2> Enter your availability to conduct interviews </h2>
          </Grid>
        </Grid>
        <style>
          {`
            .rbc-time-view .rbc-time-slot {
              min-height: 40px; /* Adjust this value to increase/decrease row height */
            }
            .rbc-allday-cell {
              display: none !important;
            }
            .rbc-event-content {
              color: inherit !important;
            }
          `}
        </style>
        <DragAndDropCalendar
          localizer={localizer}
          events={[...eventsList, ...interviewDates]} // Combine availability and interview dates
          startAccessor={(event: Event) => event.start} // Specify how to access the start date of an event
          endAccessor={(event: Event) => event.end} // Specify how to access the end date of an event
          style={{ height: "90%" }}
          defaultView="week"
          views={["week"]}
          selectable // Allow users to select time slots to create new events
          resizable // Enable resizing of existing events
          onSelectSlot={handleSelectSlot} // Handle new slot selection
          onEventResize={handleEventResize} // Handle resizing of existing events
          onEventDrop={handleEventDrop} // Handle dragging (moving) of existing events
          titleAccessor={(event: Event) => event.title} // Specify how to access the title of an event
          onSelectEvent={handleSelectEvent} // This is for deleting event
          scrollToTime={scrollToTime}
          eventPropGetter={eventStyleGetter}
        />
        {/* Save Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          style={{ marginTop: "20px" }}
        >
          Save Availability
        </Button>
      </div>
    </DndProvider>
  );
};

export default AvailabilityCalendarUser;
