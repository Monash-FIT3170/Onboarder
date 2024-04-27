import { Typography } from "@mui/material";

// Endpoint to be used:
//      GET /recruitmentRounds/{roundId}/openings-
//        View all openings for a specific recruitment round
// Sample response type:
// {
//     "total_pages": {},
//     "current_page": {},
//     "results": {
//         [
//             "opening_name": {},
//             "applications_received": {},
//             "opening_status": {},
//         ]
//     }
// }

function OpeningsTable() {
  return <Typography variant="h5"> Openings Table </Typography>;
}

export default OpeningsTable;
