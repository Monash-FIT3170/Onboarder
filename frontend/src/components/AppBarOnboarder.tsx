import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import { useAuthStore } from "../util/stores/authStore";

function AppBarOnBoarder() {
	const { user, signOut } = useAuthStore();

	return (
		<Box sx={{ flexGrow: 1 }}>
			<CssBaseline>
				<AppBar position="static" sx={{ margin: 0 }}>
					<Toolbar>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							Onboarding: Recruitment Platform
						</Typography>

						{user && (
							<>
								<Typography variant="body1" sx={{ marginRight: 2 }}>
									{user.email}
								</Typography>
								<Button color="inherit" onClick={signOut}>
									Sign out
								</Button>
							</>
						)}
					</Toolbar>
				</AppBar>
			</CssBaseline>
		</Box>
	);
}

export default AppBarOnBoarder;
