import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { enAU } from "date-fns/locale";
import { Typography, Button, Grid, IconButton, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useApplicantStore } from "../util/stores/applicantStore";
import { useOpeningStore } from "../util/stores/openingStore";
import { useAuthStore } from "../util/stores/authStore";
import { EventInteractionArgs } from "react-big-calendar/lib/addons/dragAndDrop";

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

const DragAndDropCalendar = withDragAndDrop(Calendar);

const ManuallyAddInterview: React.FC = () => {
  const navigate = useNavigate();
  const { selectedApplicant } = useApplicantStore();
  const { selectedOpening } = useOpeningStore();
  const authStore = useAuthStore();
  const [eventsList, setEventsList] = useState<Event[]>([]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const newEvent = { start, end, title: "Interview" };
    setEventsList([...eventsList, newEvent]);
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

  const handleSave = () => {
    // Implement save functionality here
    console.log("Saving interview dates:", eventsList);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ height: "100vh", p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                position: "relative",
              }}
            >
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ position: "absolute", left: 0 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h4"
                sx={{ width: "100%", textAlign: "center" }}
              >
                Add Interview Date for Candidate
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Candidate Email
              </Typography>
              <Typography variant="body1" mb={2}>
                {selectedApplicant?.applicant_email}
              </Typography>

              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Opening
              </Typography>
              <Typography variant="body1" mb={2}>
                {selectedOpening?.title}
              </Typography>

              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Recruitment Round
              </Typography>
              <Typography variant="body1" mb={2}>
                {`${authStore.team_name} ${selectedOpening?.recruitment_round_id}`}
              </Typography>

              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mt: 2 }}
              >
                Save
              </Button>
            </Box>
          </Grid>
          <Grid item xs={9}>
            <DragAndDropCalendar
              localizer={localizer}
              events={eventsList}
              startAccessor={(event: any) => new Date(event.start)}
              endAccessor={(event: any) => new Date(event.end)}
              style={{ height: "80vh" }}
              defaultView="week"
              views={["week"]}
              selectable
              resizable
              onSelectSlot={handleSelectSlot}
              onEventResize={
                handleEventResize as (
                  args: EventInteractionArgs<object>,
                ) => void
              }
              onEventDrop={
                handleEventDrop as (args: EventInteractionArgs<object>) => void
              }
              titleAccessor={(event: object) =>
                (event as { title: string }).title
              }
            />
          </Grid>
        </Grid>
      </Box>
    </DndProvider>
  );
};

export default ManuallyAddInterview;
