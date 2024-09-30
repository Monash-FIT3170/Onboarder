import { useState } from "react";
import { smtpexpressClient } from "../../services/smtp";

const CalendarInvite = () => {
  const [loading, setLoading] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [email, setEmail] = useState("");
  const [startDateInvite, setStartDateInvite] = useState("");
  const [endDateInvite, setEndDateInvite] = useState("");
  const [location, setLocation] = useState("");
  const [url, setUrl] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await smtpexpressClient.sendApi.sendMail({
        subject: "Calender Invite",
        message: "Please find the attached calendar invite.",
        sender: {
          email: import.meta.env.VITE_SMTP_PROJECT_SENDER_EMAIL,
          name: "Alex Johnson", // Full name of the sender for personalization
        },
        recipients: {
          email: email,
          // name: "John Doe", // name of the recipient for personalization
        },
        calendarEvent: {
          title: eventTitle,
          startDate: new Date(startDateInvite),
          endDate: new Date(endDateInvite),
          organizer: "alex.johnson@company.com", //  use the email of the event organizer
          location: location === "remote" ? url : meetingLocation,
          url: url, // meeting link
          description: description,
        },
      });

      // Notify user of successful submission
      alert("Please check your email to view the sent message");
      setLoading(false);

      // clear your form fields.
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. Please try again later.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h2 className="" title="documents, images and more">
        Calander Invite Email Form
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="emailInput">Email:</label> <br />
          <input
            id="emailInput"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="johnDoe@gmail.com"
          />
        </div>

        <div>
          <label>Title</label>
          <input
            type="text"
            required
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Event Title"
          />
        </div>

        <div>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event Description"
          />
        </div>

        <div>
          <label>Date and Start Time</label> <br />
          <input
            required
            type="datetime-local"
            value={startDateInvite}
            onChange={(e) => setStartDateInvite(e.target.value)}
          />
        </div>

        <div>
          <label>Date and End Time</label>
          <input
            required
            type="datetime-local"
            value={endDateInvite}
            onChange={(e) => setEndDateInvite(e.target.value)}
          />
        </div>

        <div>
          <label>Location</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value=""></option>
            <option value="remote">Remote</option>
            <option value="physical">Physical</option>
          </select>
        </div>

        {location === "remote" && (
          <div>
            <label>URL Link</label>
            <input
              required
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Meeting Link"
            />
          </div>
        )}

        {location === "physical" && (
          <div>
            <label>Enter Location</label>
            <input
              required
              type="text"
              value={meetingLocation}
              onChange={(e) => setMeetingLocation(e.target.value)}
              placeholder="Meeting Location address"
            />
          </div>
        )}

        <button>{loading ? "Loading..." : "Send Calender Invite 🚀"}</button>
      </form>
    </div>
  );
};

export default CalendarInvite;
