import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { DndProvider } from "react-dnd"; // Provides the drag-and-drop context for the calendar
import { HTML5Backend } from "react-dnd-html5-backend"; // HTML5 backend for react-dnd, handles drag-and-drop interactions
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"; // Higher-order component to enable drag-and-drop on the calendar
import format from "date-fns/format"; // Utility for formatting dates
import parse from "date-fns/parse"; // Utility for parsing dates
import startOfWeek from "date-fns/startOfWeek"; // Utility for determining the start of the week
import getDay from "date-fns/getDay"; // Utility for getting the day of the week
import { Button } from "@mui/material"; // Import the Button component 
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import base styles for the calendar
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"; // Import additional styles for drag-and-drop functionality
import { enAU } from "date-fns/locale";
import { useParams } from "react-router-dom";

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

	// Get the current date and calculate two weeks from the current date
	const today = new Date();
	const twoWeeksLater = new Date();
	twoWeeksLater.setDate(today.getDate() + 14);

	// Function to handle the selection of a new time slot in the calendar
	const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
		const overlappingEvent = eventsList.find((event) => start < event.end && end > event.start);
		
		if (overlappingEvent) {
			alert(
				"The selected time slot overlaps with an existing event. Please adjust the existing event or select a different time slot."
			);
		} else {
			const updatedEvents = [...eventsList, { start, end, title: "Available Slot" }];
			setEventsList(updatedEvents);
			// handleSave(updatedEvents); // Automatically save changes
		}
	};

	// Function to handle resizing of existing events
	const handleEventResize = ({ event, start, end }: { event: Event; start: Date; end: Date }) => {
		const updatedEvents = eventsList.map((existingEvent) =>
			existingEvent === event ? { ...existingEvent, start, end } : existingEvent
		);
		setEventsList(updatedEvents);
		// handleSave(updatedEvents); // Automatically save changes
	};

	// Function to handle dragging (moving) existing events to a new time slot
	const handleEventDrop = ({ event, start, end }: { event: Event; start: Date; end: Date }) => {
		const updatedEvents = eventsList.map((existingEvent) =>
			existingEvent === event ? { ...existingEvent, start, end } : existingEvent
		);
		setEventsList(updatedEvents);
		// handleSave(updatedEvents); // Automatically save changes
	};

	const API_URL = "http://127.0.0.1:3000/";

	const handleSave = async (updatedEvents: Event[]) => {
		try {
			const response = await fetch(`${API_URL}/updateAvailability/${applicationId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ candidate_availablity: updatedEvents }),
			});

			await response.json();
		} catch (error) {
			console.error("Error saving availability data:");
		}
	};

	useEffect(() => {
		const descryptId = async () => {
			try {
				const response = await fetch(`${API_URL}decrypt_id/${id}`);
				const data = await response.json();
				setApplicationId(data.data.decrypted_id);

				const parsedData = data.data.candidate_availability.map((event: Event) => {
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

		descryptId();
	}, [id]);

	return (
		// DndProvider wraps the calendar component to provide drag-and-drop functionality
		<DndProvider backend={HTML5Backend}>
			<div style={{ height: "80vh", padding: "20px", paddingTop: "0" }}>
				<div
					style={{
						width: "100%",
						display: "flex",
						justifyContent: "center",
						marginBottom: "1rem",
						alignItems: "center",
					}}
				>
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
						<h2> Interview Availability Submission</h2>
						<p style={{ maxWidth: "900px", textAlign: "center" }}>
							Select your available slots for the interview process in the next two weeks.
						</p>
					</div>
				</div>

				<DragAndDropCalendar
					localizer={localizer}
					events={eventsList}
					startAccessor={(event: Event) => event.start} // Specify how to access the start date of an event
					endAccessor={(event: Event) => event.end} // Specify how to access the end date of an event
					style={{ height: "80%" }}
					defaultView="week"
					views={["week"]}
					selectable // Allow users to select time slots to create new events
					resizable // Enable resizing of existing events
					onSelectSlot={handleSelectSlot} // Handle new slot selection
					onEventResize={handleEventResize} // Handle resizing of existing events
					onEventDrop={handleEventDrop} // Handle dragging (moving) of existing events
					titleAccessor={(event: Event) => event.title} // Specify how to access the title of an event
					min={today} // Earliest selectable date
					max={twoWeeksLater} // Latest selectable date (2 weeks from now)
				/>
				{/* Save Button */}
				<Button
					variant="contained"
					color="primary"
					onClick={() => handleSave(eventsList)} // Pass the eventsList to the handleSave function
            		style={{ marginTop: "20px" }}
        		 >
					Save Availability
				</Button>
			</div>
		</DndProvider>
	);
};

export default AvailabilityCalendar;

