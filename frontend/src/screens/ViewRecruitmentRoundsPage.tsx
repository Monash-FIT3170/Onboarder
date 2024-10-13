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
import axios from "axios";
import Modal from "@mui/material/Modal";
import BackIcon from "../assets/BackIcon";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecruitmentStore } from "../util/stores/recruitmentStore";
import { useAuthStore } from "../util/stores/authStore";
import { useStudentTeamStore } from "../util/stores/studentTeamStore";
import { getBaseAPIURL } from "../util/Util";
import React from "react";
import PermissionButton from "../components/PermissionButton";

// Css style file
const styles = {
  scrollableTableBody: {
    // height: "calc(100vh - 650px)",
    maxHeight: "calc(4 * 69.5px + 57px)",
    minHeight: "69.5px",
    overflowY: "auto",
    display: "block",
  },
};

// Css style for the modal
const styleLink = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ViewRecruitmentRoundsPage = () => {
  // State hooks
  // Modal Link modify
  const [urlLink, setUrlLink] = useState("");
  const [openLink, setOpenLink] = React.useState(false);
  const handleOpenLink = () => setOpenLink(true);
  const handleCloseLink = () => setOpenLink(false);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddRoundClick = () => {
    navigate("/add-recruitment-round");
  };

  // Constants
  enum Status {
    A = "Active",
    I = "Inactive",
    R = "Archived",
  }
  const SHOW_ARCHIVED_AMOUNT = 3;
  const authStore = useAuthStore();
  const studentTeamId = authStore.team_id;
  const BASE_API_URL = getBaseAPIURL();
  const API_URL = `${BASE_API_URL}/student-team/${studentTeamId}/recruitment-round`; // Working

  // Store hooks
  const studentTeamStore = useStudentTeamStore();

  const setRecruitmentDetails = useRecruitmentStore(
    (state) => state.setRecruitmentDetails,
  );

  // Effects hooks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);

        setData(response.data);
        setUrlLink(
          studentTeamStore.studentTeams.find(
            (item) => item.student_team_id === authStore.team_id,
          )?.student_team_meeting_link || "",
        );
      } catch (error) {
        console.error("There was an error!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler functions

  const handleViewRound = (id: number) => {
    setRecruitmentDetails({
      roundId: id,
      roundApplicationDeadline: null,
      roundInterviewPreferenceDeadline: null,
      roundInterviewPeriod: null,
      roundName: null,
      roundStatus: null,
    });
    navigate("/recruitment-round-details");
  };

  const handleEditLink = async () => {
    try {
      const response = await axios.patch(
        `${BASE_API_URL}/student-team/${studentTeamId}`,
        { meeting_link: urlLink },
      );
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateTeamLeads = () => {
    navigate("/view-team-leads");
  };

  const handleViewTeamMembers = () => {
    navigate("/view-team-members");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

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

  console.log(studentTeamStore.studentTeams);

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
            <Typography variant="h4">
              {authStore.team_name + " Recruitment Rounds"}
            </Typography>
          </Box>
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
                <Grid>
                  <Grid alignItems="center" justifyContent="flex-start">
                    <Grid item xs={10} sm={10}>
                      <h3 style={{ fontWeight: "normal" }}>
                        Enter URL Here (Optional):
                      </h3>
                      <TextField
                        placeholder="https://zoom-example.com"
                        id="outlined-multiline-static"
                        label="Global Meeting URL"
                        fullWidth
                        variant="filled"
                        value={urlLink}
                        onChange={(e) => setUrlLink(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={30} sm={30} marginLeft={0}>
                  <Grid
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Grid item xs={10} sm={10}>
                      <Box mt={2}>
                        <Typography variant="body1" component="p" paragraph>
                          Onboarder does not generate zoom/meeting links.
                          <br />
                          To add a global/reusable meeting link, please enter
                          the link here.
                          <br />
                          This will be used as meeting link for all interviews
                          that your team conducts.
                          <br />
                          Alternatively, you can assign individual links on
                          Google Calendar after you have sent out the event
                          invites.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} mt={4}>
                  <Box display="flex" justifyContent="center" gap={2}>
                    <PermissionButton
                      action="update"
                      subject="Interview"
                      variant="contained"
                      onClick={handleEditLink}
                      tooltipText="You do not have permission to update the interview link"
                    >
                      Save
                    </PermissionButton>
                    <Button variant="contained" onClick={handleCloseLink}>
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Box>
            </Modal>
          </Grid>

          <Box>
            <Button
              variant="contained"
              onClick={handleOpenLink}
              style={{ marginRight: "10px" }}
            >
              Configure Interview Link
            </Button>

            <Button
              variant="outlined"
              color="primary"
              style={{ marginRight: "10px" }}
              onClick={handleViewTeamMembers}
            >
              View Team Members
            </Button>

            <PermissionButton
              action="assign"
              subject="TeamLead"
              variant="contained"
              color="primary"
              onClick={handleAllocateTeamLeads}
              tooltipText="You do not have permission to allocate team leads"
            >
              Allocate Team Leads
            </PermissionButton>
          </Box>
        </Box>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ mb: 2, ml: 8, mt: 1 }}>
              {"Team Description: " +
                studentTeamStore.studentTeams.find(
                  (item) => item.student_team_id === authStore.team_id,
                )?.student_team_description}
            </Typography>
          </Grid>
        </Grid>
        {/* <Typography variant="h5">Recruitment Rounds</Typography> */}
        <section>
          <Grid
            container
            alignItems="baseline"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Grid item xs={6}>
              {/* <TextField
                style={{ marginBottom: "1rem", width: "25%" }}
                variant="outlined"
                placeholder="Round Name, ApplicationDeadline, etc..."
                size="small"
                label="Search"
                fullWidth
                onChange={(e) => setFilter(e.target.value)}
              /> */}
              <Grid container alignItems="baseline">
                <Grid item>
                  <Typography variant="h5" mr={2}>
                    Active Recruitment Rounds
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">
                    Showing{" "}
                    {
                      data.filter(
                        (item: any) => item.status == "I" || item.status == "A",
                      ).length
                    }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <PermissionButton
                action="create"
                subject="Round"
                onClick={handleAddRoundClick}
                variant="contained"
                tooltipText="You don't have permission to add a recruitment round"
              >
                ADD ROUND
              </PermissionButton>
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
          <Grid container alignItems="baseline" sx={{ mb: 1, mt: 2 }}>
            <Grid item>
              <Typography variant="h5" mr={2}>
                Archived Recruitment Rounds
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">
                Showing{" "}
                {data.filter((item: any) => item.status == "R").length < 3
                  ? data.filter((item: any) => item.status == "R").length
                  : SHOW_ARCHIVED_AMOUNT}{" "}
                of {data.filter((item: any) => item.status == "R").length}
              </Typography>
            </Grid>
          </Grid>

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

export default ViewRecruitmentRoundsPage;
