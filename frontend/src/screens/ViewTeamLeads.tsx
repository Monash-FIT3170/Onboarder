import { useState, useEffect } from "react";
import axios from "axios";

// Define the structure of a Team Lead
export interface TeamLeadProps {
  id: number;
  name: string;
}

function ViewTeamLeads() {
  // State to store the list of team leads
  const [teamLeads, setTeamLeads] = useState<TeamLeadProps[]>([]);

  // State to manage loading status
  const [loading, setLoading] = useState(true);

  // Fetch the team leads data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamLeadsResponse = await axios.get(
          `http://127.0.0.1:3000/teamleads`
        );
        setTeamLeads(teamLeadsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {teamLeads.map((teamLead: TeamLeadProps) => (
        <div key={teamLead.id}>
          <h2>{teamLead.name}</h2>
          <p>{teamLead.role}</p>
        </div>
      ))}
    </div>
  );
}

export default ViewTeamLeads;
