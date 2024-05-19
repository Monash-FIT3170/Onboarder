import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";

function AppBarOnBoarder() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline>
        <AppBar position="static" sx={{ margin: 0 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Onboarding: Recruitment Platform
            </Typography>
          </Toolbar>
        </AppBar>
      </CssBaseline>
    </Box>
  );
}

export default AppBarOnBoarder;
