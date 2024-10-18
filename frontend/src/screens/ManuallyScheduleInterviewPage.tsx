import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import axios from "axios";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import { enAU } from "date-fns/locale";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import { useApplicantStore } from "../util/stores/applicantStore";
import { useAuthStore } from "../util/stores/authStore";
import { useOpeningStore } from "../util/stores/openingStore";
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

const DragAndDropCalendar = withDragAndDrop(Calendar);

const ManuallyScheduleInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedApplicant } = useApplicantStore();
  const { selectedOpening } = useOpeningStore();
  const authStore = useAuthStore();
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const BASE_API_URL = getBaseAPIURL();
  const scrollToTime = new Date();
  scrollToTime.setHours(9, 0, 0);

  useEffect(() => {
    if (selectedApplicant?.interview_date) {
      const start = selectedApplicant?.interview_date;
      const startDate = new Date(start);
      const thirtyMinutesLater = moment(startDate).add(30, "minutes").toDate();
      const newEvent = {
        start: startDate,
        end: thirtyMinutesLater,
        title: "Interview",
      };
      setEventsList([newEvent]);
    }
  }, [selectedApplicant]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // Ensure the slot is exactly 30 minutes
    const thirtyMinutesLater = moment(start).add(30, "minutes").toDate();
    // Create a new event
    const newEvent = {
      start: start,
      end: thirtyMinutesLater,
      title: "Interview",
    };
    setEventsList([newEvent]);
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
    // Implement save functionality here
    const profile_id = authStore?.profile;
    const applicationId = selectedApplicant?.application_id;
    if (!eventsList.length) {
      alert("No interview dates selected");
      return;
    }
    const interviewDate = eventsList[0].start;

    // Format the date as ISO8601 with the local time zone offset
    const formattedDate = format(interviewDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

    try {
      await axios.patch(`${BASE_API_URL}/application/${applicationId}`, {
        interview_date: formattedDate,
        profile_id,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(
          `Failed to update interview date: ${error.response.data.message || "Please try again."}`,
        );
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
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
              startAccessor="start"
              endAccessor="end"
              style={{ height: "75vh" }}
              defaultView="week"
              views={["week"]}
              selectable={true}
              scrollToTime={scrollToTime}
              step={30} // Set the step to 30 minutes
              timeslots={1} // Each slot is 30 minutes
              onSelectSlot={(slotInfo) => {
                if (eventsList.length === 0) {
                  handleSelectSlot(slotInfo);
                } else {
                  alert("Only one interview slot can be selected.");
                }
              }}
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

export default ManuallyScheduleInterviewPage;
