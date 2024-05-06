import { OpeningsTable, OpeningsTableProps } from "../components/OpeningsTable";

const mockData: OpeningsTableProps = {
  results: [
    {
      opening_name: "Bruh",
      applications_received: 10,
      opening_status: "All Reviewed",
    },
    {
      opening_name: "Bruh 2",
      applications_received: 5,
      opening_status: "5 Pending Review",
    },
  ],
};

function RecruitmentRoundDetailsPage() {
  return (
    <>
      <OpeningsTable {...mockData}></OpeningsTable>
    </>
  );
}

export default RecruitmentRoundDetailsPage;
