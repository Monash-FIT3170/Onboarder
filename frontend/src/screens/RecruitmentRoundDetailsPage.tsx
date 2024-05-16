import { OpeningsTable, OpeningsTableProps } from "../components/OpeningsTable";
import CustomTable from "../components/Table";
import React, { useState, useEffect } from "react";
import axios from "axios";

const mockData: OpeningsTableProps = {
  results: [
    {
      opening_name: "Events Officer",
      applications_received: 10,
      opening_status: "All Reviewed",
    },
    {
      opening_name: "Social Media Manager",
      applications_received: 5,
      opening_status: "5 Pending Review",
    },
  ],
};

const tableData = [
  {
    deadline: "2024-05-10",
    status: "Open",
    openings: 3,
    applicationsReceived: 45,
  },
  {
    deadline: "2024-06-01",
    status: "Closed",
    openings: 2,
    applicationsReceived: 30,
  },
];

function RecruitmentRoundDetailsPage() {
  const [rounds, setRounds] = useState([]);
  const [openings, setOpening] = useState<OpeningsTableProps>({ results: [] });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roundsResponse = await axios.get(
          "http://127.0.0.1:3000/recruitmentRounds/2"
        );
        const openingsResponse = await axios.get(
          "http://127.0.0.1:3000/recruitmentRounds/2/openings"
        );

        setRounds(roundsResponse.data);
        setOpening({ results: openingsResponse.data });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const archiveRound = async (id) => {
    try {
      await axios.post(`/api/recruitment-rounds/${id}/archive`);
      // Update the state to remove the archived round
      setRounds((prevRounds) => prevRounds.filter((round) => round.id !== id));
    } catch (error) {
      console.error("Error archiving round:", error);
    }
  };

  return (
    <>
      <div style={{ marginTop: "10px" }}>
        <CustomTable entries={tableData} />
      </div>
      <div style={{ marginTop: "100px" }}>
        <OpeningsTable {...mockData}></OpeningsTable>
      </div>
    </>
  );
}

export default RecruitmentRoundDetailsPage;
