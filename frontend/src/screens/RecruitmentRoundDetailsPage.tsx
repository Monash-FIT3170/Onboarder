import { OpeningsTable, OpeningsTableProps } from "../components/OpeningsTable";
import CustomTable from "../components/Table";

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
    deadline: '2024-05-10',
    status: 'Open',
    openings: 3,
    applicationsReceived: 45
  },
  {
    deadline: '2024-06-01',
    status: 'Closed',
    openings: 2,
    applicationsReceived: 30
  }
];

function RecruitmentRoundDetailsPage() {
  return (
    <>
      <div style={{ marginTop: '10px' }}>
        <CustomTable entries={tableData} />
      </div>
      <div style={{ marginTop: '100px' }}>
        <OpeningsTable  {...mockData}></OpeningsTable>
      </div>

    </>
  );
}

export default RecruitmentRoundDetailsPage;
