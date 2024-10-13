import HomeIcon from "@mui/icons-material/Home";
import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  CssBaseline,
  Divider,
  Link,
  Stack,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../util/stores/authStore";
import { useRouteProtectionStore } from "../util/stores/routeProtectionStore";
import { useTheme as useCustomTheme } from "../util/ThemeContext";
import RoleIcon from "../util/RoleIcon";

/**
 * Maps paths to names for breadcrumbs
 * @param {string} key - path
 */
const pathToNameMap: { [key: string]: string } = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/allocate-team-leads": "Allocate Team Leads",
  "/login": "Login",
  "/recruitment-round-details": "Recruitment Round Details",
  "/create-opening": "Create Opening",
  "/view-recruitment-rounds": "View Recruitment Rounds",
  "/add-recruitment-round": "Add Recruitment Round",
  "/opening-details": "Opening Details",
  "/onboarder-openings": "Onboarder Openings",
  "/application-submission": "Application Submission",
  "/review-applicant": "Review Application",
  "/task-email-format": "Task Email Format",
  "/candidate-availability-calendar": "Availability Calendar",
  "/view-team-members": "View Team Members",
  "/interview-scheduling": "View Interview Allocation",
  "/interview-feedback": "Interview Feedback",
  "/user-availability-calendar": "Availability Calendar User",
  "/view-team-leads": "View Team Leads",
  "/manually-schedule-interview": "Manually Schedule Interview",
};

function AppBarOnBoarder() {
  const { team_name, role, signOut } = useAuthStore();
  const isProtectedRoute = useRouteProtectionStore(
    (state) => state.isProtectedRoute,
  );
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const { darkMode, toggleTheme } = useCustomTheme();
  const locationPath = location.pathname.split("/")[1];
  const handleViewAvailability = () => {
    navigate("/user-availability-calendar");
  };

  const [pathnames, setPathnames] = useState([locationPath]);

  useEffect(() => {
    if (locationPath === "dashboard") {
      // setPathnames(["Dashboard"]);
    } else {
      setPathnames((prevPathnames) => {
        const newPathnames = location.pathname.split("/").filter((x) => x);
        const allPathnames = [...prevPathnames, ...newPathnames];
        const uniquePathnames = Array.from(new Set(allPathnames));
        for (let i = 0; i < uniquePathnames.length; i++) {
          if (uniquePathnames[i] === locationPath) {
            return uniquePathnames.slice(0, i + 1);
          }
        }
        return uniquePathnames;
      });
    }
  }, [location.pathname]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar
        position="static"
        // enableColorOnDark
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Onboarder
          </Typography>
          {isProtectedRoute && !isDashboard && team_name && role && (
            <Typography
              variant="caption"
              component="div"
              sx={{
                marginRight: 2,
                marginLeft: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" component={"span"}>
                Viewing Team:
              </Typography>
              <Typography variant="caption" component={"span"}>
                &nbsp;
                {team_name}
              </Typography>
              <Typography variant="caption" component={"span"}>
                &nbsp;
              </Typography>
              <Typography variant="caption" component={"span"}>
                as:
              </Typography>
              <Typography
                variant="caption"
                component={"span"}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {" "}
                <RoleIcon role={role} color="white" />
                {role}
              </Typography>
            </Typography>
          )}
          {locationPath !== "login" && locationPath !== "onboarder-openings" ? (
            <>
              <Box sx={{ flexGrow: 1 }}></Box>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Button
                  key={1}
                  sx={{ color: "#fff" }}
                  onClick={handleViewAvailability}
                >
                  Your Interviews and Availability
                </Button>
                <Button key={2} sx={{ color: "#fff" }} onClick={signOut}>
                  Sign out
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ flexGrow: 1 }}></Box>
          )}
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ mx: 2, bgcolor: "grey.600" }}
          />
          <Stack
            direction="row"
            spacing={0}
            sx={{ alignItems: "center", ml: 1 }}
          >
            <Typography>Light</Typography>
            <Switch
              checked={darkMode}
              onChange={toggleTheme}
              inputProps={{ "aria-label": "controlled" }}
              color="default"
            />
            <Typography>Dark</Typography>
          </Stack>
        </Toolbar>
      </AppBar>
      {isProtectedRoute && !isDashboard && team_name && role && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ ml: 2, mt: 1, flexGrow: 1 }}>
          {pathnames.map((value, index) => {
            const isLast = index === pathnames.length - 1;
            const isFirst = index === 0;
            return isFirst && isLast ? (
              <Typography
                sx={{
                  color: "text.primary",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                {pathToNameMap[`/${value}`] + " /"}
              </Typography>
            ) : isLast ? (
              <Typography sx={{ color: "text.primary" }} variant="body2">
                {pathToNameMap[`/${value}`]}
              </Typography>
            ) : isFirst ? (
              <Link
                underline="hover"
                color="inherit"
                sx={{ display: "flex", alignItems: "center" }}
                variant="body2"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                {pathToNameMap[`/${value}`]}
              </Link>
            ) : (
              <Link underline="hover" color="inherit" variant="body2">
                {pathToNameMap[`/${value}`]}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
    </Box>
  );
}

export default AppBarOnBoarder;
