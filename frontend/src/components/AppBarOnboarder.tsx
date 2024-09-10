import React from "react";
import { styled, alpha } from "@mui/material/styles";
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	CssBaseline,
	Button,
	Menu,
	MenuItem,
	MenuProps,
} from "@mui/material";
import {
	KeyboardArrowDown as KeyboardArrowDownIcon,
	Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useAuthStore } from "../util/stores/authStore";

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
		color: theme.palette.mode === "light" ? "rgb(55, 65, 81)" : theme.palette.grey[300],
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
				backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
			},
		},
	},
}));

function AppBarOnBoarder() {
	const { user, signOut } = useAuthStore();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const navigate = useNavigate(); // Use navigate to navigate to different pages

	// Function to handle the view availability button click
	const handleViewAvailability = () => {
		navigate("/availability-calendar-user"); // Navigate to the availability calendar page
	}

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleViewAvailability = () => {
		//redirect to the view availability page once created
		navigate('/');
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<CssBaseline />
			<AppBar position="static" sx={{ margin: 0 }}>
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Onboarding: Recruitment Platform
					</Typography>

					{user && (
						<>
							<Button
								id="demo-customized-button"
								aria-controls={open ? "demo-customized-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={open ? "true" : undefined}
								variant="outlined"
								disableElevation
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
							>
								View Availability and Interviews
							</Button>
							
							{/* Button to view availability calendar */}
							<Button
								variant="contained"
								disableElevation
								onClick={handleViewAvailability} // Call the function to handle the view availability button click
								sx={{
									color: "white",
									marginLeft: 2, // Adjust margin for spacing
									borderColor: "rgba(255, 255, 255, 0.5)",
									"&:hover": {
										backgroundColor: "rgba(255, 255, 255, 0.2)",
										borderColor: "white",
									},
									textTransform: "none",
								}}
							>
								View Availability 
							</Button>
							
							<Button
								variant="outlined"
								disableElevation
								onClick={signOut} // Directly call the signOut function
								sx={{
									color: "white",
									borderColor: "rgba(255, 255, 255, 0.5)",
									"&:hover": {
										backgroundColor: "rgba(255, 255, 255, 0.2)",
										borderColor: "white",
									},
									textTransform: "none",
									marginLeft: 2, // Adds space between the buttons
								}}
							>
								Sign Out
							</Button>
							
						</>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
}

export default AppBarOnBoarder;
