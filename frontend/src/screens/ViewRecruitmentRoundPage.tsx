import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  TableSortLabel,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { useRecruitmentStore } from "../util/stores/recruitmentStore";

const styles = {
  recruitmentRoundPage: {
    fontFamily: "Arial, sans-serif",
  },
  studentTeam: {
    color: "gray",
    marginBottom: "1rem",
  },
  section: {
    marginBottom: "2rem",
  },
  addRoundButton: {
    marginBottom: "1rem",
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
  },
  viewButton: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  scrollableTableBody: {
    height: "calc(100vh - 400px)",
    overflowY: "auto",
    display: "block",
  },
};

const ViewRecruitmentRoundPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  enum Status {
    A = "Active",
    I = "Inactive",
    R = "Archived",
  }
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const SHOW_ARCHIVED_AMOUNT = 3;
  const setRecruitmentDetails = useRecruitmentStore(
    (state) => state.setRecruitmentDetails
  );

  const formatDeadline = (deadline: Date) => {
    return `${deadline.getDate().toString().padStart(2, "0")}/${(
      deadline.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${deadline.getFullYear()} ${deadline
      .getHours()
      .toString()
      .padStart(2, "0")}:${deadline.getMinutes().toString().padStart(2, "0")}`;
  };

  const filterData = (round: any) => {
    const {
      student_team_name,
      id,
      deadline,
      status,
      semester,
      year,
      openings_count,
    } = round;
    const formattedDeadline = formatDeadline(new Date(deadline));
    const statusText =
      Status[status as keyof typeof Status] || "Unknown Status";

    return [
      `${student_team_name} ${id}`,
      formattedDeadline,
      statusText,
      semester,
      year,
      openings_count,
    ].some((value: any) =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    );
  };

  const API_URL = "http://127.0.0.1:3000/recruitmentRounds";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.error("There was an error!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewRound = (id: number) => {
    setRecruitmentDetails({roundId: id, roundDeadline: null, roundName: null})
    navigate("/recruitment-details-page");
  };

  return (
    <div style={styles.recruitmentRoundPage}>
      <main>
        <Typography variant="h4" style={styles.studentTeam}>
          Recruitment Rounds
        </Typography>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <div></div>
            {Array.isArray(data) &&
              data
                .map((item: any) =>
                  item.student_team_name.length > 0 ? (
                    <h3>{item.student_team_name}</h3>
                  ) : (
                    <h3>Name Not Found</h3>
                  )
                )
                .at(0)}
          </Grid>
        </Grid>
        <section style={styles.section}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <h4>
                Current Recruitment Rounds: Showing{" "}
                {
                  data.filter(
                    (item: any) => item.status == "I" || item.status == "R"
                  ).length
                }
              </h4>
            </Grid>
            <Grid item>
              <Link
                to="/addrecruitmentround"
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" style={styles.addRoundButton}>
                  ADD ROUND
                </Button>
              </Link>
            </Grid>
          </Grid>
          <TextField
            style={{ marginBottom: "1rem", width: "25%" }}
            variant="outlined"
            placeholder="Round Name, Deadline, etc..."
            size="small"
            label="Filter"
            fullWidth
            onChange={(e) => setFilter(e.target.value)}
          />
          <TableContainer component={Paper} style={styles.scrollableTableBody}>
            <Table style={styles.table} stickyHeader>
              <TableHead style={styles.tableHeader}>
                <TableRow>
                  <TableCell>Round Name</TableCell>
                  <TableCell>
                    Deadline
                    <TableSortLabel></TableSortLabel>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Openings</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from(new Array(5)).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            variant="rectangular"
                            width={80}
                            height={30}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : data
                      .filter((item: any) => item.status != "R")
                      .filter(filterData)
                      .map((item: any) => {
                        const deadline = new Date(item.deadline);
                        const formattedDeadline = formatDeadline(deadline);
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              {item.student_team_name + " " + item.id}
                            </TableCell>
                            <TableCell>{formattedDeadline}</TableCell>
                            <TableCell>
                              {Status[item.status as keyof typeof Status] ||
                                "Unknown Status"}
                            </TableCell>
                            <TableCell>{item.semester}</TableCell>
                            <TableCell>{item.year}</TableCell>
                            <TableCell>{item.openings_count}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                style={{ padding: 0 }}
                                onClick={() => {
                                  handleViewRound(item.id);
                                }}
                              >
                                VIEW
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
        <section style={styles.section}>
          <h4>
            Archived Recruitment Rounds: Showing {SHOW_ARCHIVED_AMOUNT} of{" "}
            {data.filter((item: any) => item.status == "R").length}
          </h4>
          <TableContainer component={Paper}>
            <Table style={styles.table} stickyHeader>
              <TableHead style={styles.tableHeader}>
                <TableRow>
                  <TableCell>Round Name</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Openings</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from(new Array(5)).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                      </TableRow>
                    ))
                  : data
                      .filter((item: any) => item.status == "R")
                      .slice(0, SHOW_ARCHIVED_AMOUNT)
                      .map((item: any) => {
                        const deadline = new Date(item.deadline);
                        const formattedDeadline = formatDeadline(deadline);
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              {item.student_team_name + " " + item.id}
                            </TableCell>
                            <TableCell>{formattedDeadline}</TableCell>
                            <TableCell>
                              {Status[item.status as keyof typeof Status] ||
                                "Unknown Status"}
                            </TableCell>
                            <TableCell>{item.semester}</TableCell>
                            <TableCell>{item.year}</TableCell>
                            <TableCell>{item.openings_count}</TableCell>
                          </TableRow>
                        );
                      })}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
      </main>
    </div>
  );
};

export default ViewRecruitmentRoundPage;
