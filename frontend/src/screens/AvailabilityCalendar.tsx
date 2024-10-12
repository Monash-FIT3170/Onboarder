import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { DndProvider } from "react-dnd"; // Provides the drag-and-drop context for the calendar
import { HTML5Backend } from "react-dnd-html5-backend"; // HTML5 backend for react-dnd, handles drag-and-drop interactions
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"; // Higher-order component to enable drag-and-drop on the calendar
import { format } from "date-fns"; // Utility for formatting dates
import parse from "date-fns/parse"; // Utility for parsing dates
import startOfWeek from "date-fns/startOfWeek"; // Utility for determining the start of the week
import getDay from "date-fns/getDay"; // Utility for getting the day of the week
import { Button } from "@mui/material"; // Import the Button component
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import base styles for the calendar
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"; // Import additional styles for drag-and-drop functionality
import { enAU } from "date-fns/locale";
import { useParams } from "react-router-dom";
import { startOfDay, endOfDay, addWeeks } from "date-fns";
import axios from "axios";
import { getBaseAPIURL } from "../util/Util";

// Prettier Test

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

const AvailabilityCalendar: React.FC = () => {
  // State to manage the list of events
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const { id } = useParams();
  const [applicationId, setApplicationId] = useState(null);
  const [interviewPreferenceDeadline, setInterviewPreferenceDeadline] =
    useState(null);
  const BASE_API_URL = getBaseAPIURL();
  // Get the current date and calculate two weeks from the current date
  const today = new Date();
  const twoWeeksLater = addWeeks(today, 2);

  // First Ill set an arbitrary cutoff day, for example today
  const cutoffDate = new Date(interviewPreferenceDeadline);

  // Function to handle the selection of a new time slot in the calendar
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const overlappingEvent = eventsList.find(
      (event) => start < event.end && end > event.start,
    );

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
      // handleSave(updatedEvents); // Automatically save changes
    }
  };

  // Function to handle resizing of existing events
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
    // handleSave(updatedEvents); // Automatically save changes
  };

  // Function to handle dragging (moving) existing events to a new time slot
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
    // handleSave(updatedEvents); // Automatically save changes
  };

  const API_URL = `${BASE_API_URL}`;

  const handleSave = async () => {
    try {
      await axios.patch(`${API_URL}/application/${applicationId}`, {
        candidate_availability: eventsList,
      });
    } catch (error) {
      console.error("Error saving availability data:");
    }
  };

  useEffect(() => {
    const decryptId = async () => {
      try {
        const response = await axios.get(`${API_URL}/decrypt/${id}`);
        // console.log(response.data.data);
        const {
          candidate_availability,
          decrypted_id,
          interview_preference_deadline,
        } = response.data.data;
        // console.log(interviewPreferenceDeadline);
        setInterviewPreferenceDeadline(interview_preference_deadline);
        setApplicationId(decrypted_id);

        const parsedData = candidate_availability.map((event: Event) => {
          // Parse the stringified JSON to get the event object
          const parsedEvent = JSON.parse(event as unknown as string);

          // Convert the start and end strings to Date objects
          return {
            ...parsedEvent,
            start: new Date(parsedEvent.start),
            end: new Date(parsedEvent.end),
          };
        });

        setEventsList(parsedData);
      } catch (error) {
        console.error("Error fetching availability data:", error);
      }
    };

    decryptId();
  }, [id]);

  // Check if today is past the deadline
  if (today > cutoffDate) {
    return (
      <div style={{ height: "75vh", padding: "20px", paddingTop: "0" }}>
        <h2>Preference submission has closed</h2>
        <p>
          The deadline for submitting was {format(cutoffDate, "dd/MM/yyyy")}.
        </p>
      </div>
    );
  }

  return (
    // DndProvider wraps the calendar component to provide drag-and-drop functionality
    <DndProvider backend={HTML5Backend}>
      <div style={{ height: "75vh", padding: "20px", paddingTop: "0" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2> Interview Availability Submission</h2>
            <p style={{ maxWidth: "900px", textAlign: "center" }}>
              Select your available slots for the interview process in the next
              two weeks. Deadline: {format(cutoffDate, "dd/MM/yyyy")}
            </p>
          </div>
        </div>

        <DragAndDropCalendar
          localizer={localizer}
          events={eventsList}
          startAccessor={(event) => (event as Event).start} // Specify how to access the start date of an event
          endAccessor={(event) => (event as Event).end} // Specify how to access the end date of an event
          style={{ height: "80%" }}
          defaultView="week"
          views={["week"]}
          selectable // Allow users to select time slots to create new events
          resizable // Enable resizing of existing events
          onSelectSlot={handleSelectSlot} // Handle new slot selection
          onEventResize={handleEventResize} // Handle resizing of existing events
          onEventDrop={handleEventDrop} // Handle dragging (moving) of existing events
          titleAccessor={(event) => (event as Event).title} // Specify how to access the title of an event
          min={startOfDay(today)} // Earliest selectable date
          max={endOfDay(twoWeeksLater)} // Latest selectable date (2 weeks from now)
          step={30}
          timeslots={2}
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

export default AvailabilityCalendar;
