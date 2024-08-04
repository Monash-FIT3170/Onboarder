import React from 'react';
import { TableRow, TableCell, Button } from '@mui/material';

const RecruitmentTable = ({ data, filterData, handleViewRound, includeViewButton }) => {
  return (
    <>
      {data
        .filter(filterData)
        .map((item) => {
          const deadline = new Date(item.deadline);
          const formattedDeadline = formatDeadline(deadline);
          return (
            <TableRow key={item.id}>
              <TableCell>{item.student_team_name + " " + item.id}</TableCell>
              <TableCell>{formattedDeadline}</TableCell>
              <TableCell>
                {Status[item.status] || "Unknown Status"}
              </TableCell>
              <TableCell>{item.semester}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.openings_count}</TableCell>
              {includeViewButton && (
                <TableCell>
                  <Button
                    variant="contained"
                    style={{ padding: 0 }}
                    onClick={() => handleViewRound(item.id)}
                  >
                    VIEW
                  </Button>
                </TableCell>
              )}
            </TableRow>
          );
        })}
    </>
  );
};

export default RecruitmentTable;
