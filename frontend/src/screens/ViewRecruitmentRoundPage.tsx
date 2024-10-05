import { useEffect, useState } from "react";
import {
  Box,
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
  Skeleton,
  IconButton,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import BackIcon from "../assets/BackIcon";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { useRecruitmentStore } from "../util/stores/recruitmentStore";
import { useAuthStore } from "../util/stores/authStore";
import { useStudentTeamStore } from "../util/stores/studentTeamStore";
import { getBaseAPIURL } from "../util/Util";

const styles = {
  scrollableTableBody: {
    height: "calc(100vh - 650px)",
    minHeight: "300px",
    overflowY: "auto",
    display: "block",
  },
};

const styleLink = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ViewRecruitmentRoundPage = () => {
  // Modal Link modify
  const [loadingLink, setLoadingLink] = useState(false);
  const [urlLink, setUrlLink] = useState("");
  const [descriptionLink, setDescriptionLink] = useState("");

  const [openLink, setOpenLink] = React.useState(false);
  const handleOpenLink = () => setOpenLink(true);
  const handleCloseLink = () => setOpenLink(false);
  const handleSubmitLink = async (e: any) => {
    e.preventDefault();
    setLoadingLink(true);
  };

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

  const authStore = useAuthStore();
  const studentTeamStore = useStudentTeamStore();

  const setRecruitmentDetails = useRecruitmentStore(
    (state) => state.setRecruitmentDetails,
  );

  const filterData = (round: any) => {
    const { student_team_name, id, status, semester, year, openings_count } =
      round;
    const statusText =
      Status[status as keyof typeof Status] || "Unknown Status";

    return [
      `${student_team_name} ${id}`,
      statusText,
      semester,
      year,
      openings_count,
    ].some((value: any) =>
      value.toString().toLowerCase().includes(filter.toLowerCase()),
    );
  };

  const studentTeamId = authStore.team_id;
  const BASE_API_URL = getBaseAPIURL();
  const API_URL = `${BASE_API_URL}/student-team/${studentTeamId}/recruitment-round`; // Working

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);

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
    setRecruitmentDetails({
      roundId: id,
      roundApplicationDeadline: null,
      roundInterviewPreferenceDeadline: null,
      roundInterviewPeriod: null,
      roundName: null,
      roundStatus: null,
    });
    navigate("/recruitment-details-page");
  };
  const handleAllocateTeamLeads = () => {
    navigate("/viewTeamLeads");
  };

  const handleViewTeamMembers = () => {
    navigate("/view-team-members");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <main>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={0}
        >
          <Box display="flex" alignItems="baseline">
            <IconButton onClick={handleBack} sx={{ mr: 2 }}>
              <BackIcon />
            </IconButton>
            <Typography variant="h4">{authStore.team_name}</Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              color="primary"
              style={{ marginRight: "10px" }}
              onClick={handleViewTeamMembers}
            >
              View Team Members
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAllocateTeamLeads}
            >
              Allocate Team Leads
            </Button>
          </Box>
        </Box>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <p>
              {"Team Description: " +
                studentTeamStore.studentTeams.find(
                  (item) => item.student_team_id === authStore.team_id,
                )?.student_team_description}
            </p>
          </Grid>
        </Grid>
        <Typography variant="h5">Recruitment Rounds</Typography>
        <section>
          <h4>
            Current Recruitment Rounds: Showing{" "}
            {
              data.filter(
                (item: any) => item.status == "I" || item.status == "A",
              ).length
            }
          </h4>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={6}>
              <TextField
                style={{ marginBottom: "1rem", width: "25%" }}
                variant="outlined"
                placeholder="Round Name, ApplicationDeadline, etc..."
                size="small"
                label="Search"
                fullWidth
                onChange={(e) => setFilter(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Link
                to="/addrecruitmentround"
                style={{ textDecoration: "none" }}
              >
                <Grid>
                  <Modal
                    open={openLink}
                    onClose={handleCloseLink}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={styleLink}>
                      <Typography
                        id="modal-modal-title"
                        variant="h4"
                        component="h2"
                        align="center"
                      >
                        CONFIGURE INTERVIEW LINK
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 4 }}>
                        <Grid item xs={30} sm={30} marginLeft={10}>
                          <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            justifyContent="flex-start"
                          >
                            <Grid item xs={10} sm={10}>
                              <h3 style={{ fontWeight: "normal" }}>Url:</h3>
                              <TextField
                                placeholder="Url Link"
                                id="outlined-multiline-static"
                                label="Url link"
                                fullWidth
                                variant="filled"
                                multiline
                                rows={2}
                                value={urlLink}
                                onChange={(e) => setUrlLink(e.target.value)}
                              />
                            </Grid>
                            <Grid item></Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={30} sm={30} marginLeft={10}>
                          <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            justifyContent="flex-start"
                          >
                            <Grid item xs={10} sm={10}>
                              <h3 style={{ fontWeight: "normal" }}>
                                Description:
                              </h3>
                              <TextField
                                id="outlined-multiline-static"
                                label="Description"
                                placeholder="Description"
                                fullWidth
                                variant="filled"
                                multiline
                                rows={2}
                                value={descriptionLink}
                                onChange={(e) =>
                                  setDescriptionLink(e.target.value)
                                }
                              />
                            </Grid>
                            <Grid item></Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={2} sm={2} mt={4} marginLeft={35}>
                          <Button
                            variant="contained"
                            onClick={handleSubmitLink}
                          >
                            Save
                          </Button>
                        </Grid>
                      </Typography>
                    </Box>
                  </Modal>
                </Grid>

                <Link
                  to=""
                  style={{ textDecoration: "none", marginRight: "1rem" }}
                >
                  <Button variant="contained" onClick={handleOpenLink}>
                    Configure Interview Link
                  </Button>
                </Link>

                <Button variant="contained">ADD ROUND</Button>
              </Link>
            </Grid>
          </Grid>

          <TableContainer component={Paper} style={styles.scrollableTableBody}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Round Name</TableCell>
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
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              {authStore.team_name + " " + item.id}
                            </TableCell>

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
                                onClick={() => {
                                  handleViewRound(item.id);
                                }}
                              >
                                VIEW ROUND
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
        <section>
          <h4>
            Archived Recruitment Rounds: Showing{" "}
            {data.filter((item: any) => item.status == "R").length < 3
              ? data.filter((item: any) => item.status == "R").length
              : SHOW_ARCHIVED_AMOUNT}{" "}
            of {data.filter((item: any) => item.status == "R").length}
          </h4>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Round Name</TableCell>
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
                      </TableRow>
                    ))
                  : data
                      .filter((item: any) => item.status == "R")
                      .slice(0, SHOW_ARCHIVED_AMOUNT)
                      .map((item: any) => {
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              {authStore.team_name + " " + item.id}
                            </TableCell>
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
