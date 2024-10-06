import React from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  CssBaseline,
  Button,
  Menu,
  MenuProps,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../util/stores/authStore";
import { useRouteProtectionStore } from "../util/stores/routeProtectionStore";
import { useTheme as useCustomTheme } from "../util/ThemeContext";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

function AppBarOnBoarder() {
  const { user, team_name, role, signOut } = useAuthStore();
  const isProtectedRoute = useRouteProtectionStore(
    (state) => state.isProtectedRoute,
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";
  const theme = useTheme();
  const { darkMode, toggleTheme } = useCustomTheme();

  const handleViewAvailability = () => {
    navigate("/availability-calendar-user");
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar
        position="static"
        sx={{
          margin: 0,
          backgroundColor: darkMode
            ? theme.palette.grey[900]
            : theme.palette.primary.main,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Onboarding: Recruitment Platform
          </Typography>

          {user && (
            <>
              <Button
                onClick={handleViewAvailability}
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderColor: "white",
                  },
                  textTransform: "none",
                }}
                variant="outlined"
              >
                Your Interviews and Availability
              </Button>
              <Button
                onClick={signOut}
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderColor: "white",
                  },
                  textTransform: "none",
                  marginLeft: 2,
                  marginRight: 2,
                }}
                variant="outlined"
              >
                Sign Out
              </Button>
            </>
          )}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
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
    </Box>
  );
}

export default AppBarOnBoarder;
