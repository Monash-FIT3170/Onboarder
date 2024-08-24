import {
	Button,
	Grid,
	TableContainer,
	TableBody,
	TableHead,
	Table,
	TableRow,
	TableCell,
	Paper,
	Skeleton,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { commonDashboardResultProps } from "../components/CommonDashboardTable";
import { CommonDashboardTable } from "../components/CommonDashboardTable";
import { useAuthStore } from "../util/stores/authStore";

const styles = {
	commonDashboard: {
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

const generateSkeletonRows = () => {
	return Array.from(new Array(10)).map((_, index) => (
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
				<Skeleton variant="rectangular" height={30} />
			</TableCell>
		</TableRow>
	));
};

function CommonDashboard() {
	const [roles, setRoles] = useState<commonDashboardResultProps[]>([]);
	const [loading, setLoading] = useState(true);

	const authStore = useAuthStore();

	useEffect(() => {
		const fetchData = async () => {
			try {
				let profile_id = authStore.profile;

				console.log("Profile ID: ", profile_id);

				const rolesResponse = await axios.get(`http://127.0.0.1:3000/studentTeams/${profile_id}`); // TODO This needs to refer somehow to logged in user

				console.log(rolesResponse);
				setRoles(rolesResponse.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);
	return (
		<div style={styles.commonDashboard}>
			<main>
				<h1 style={{ textAlign: "center", fontSize: "4em", fontWeight: "100" }}>Student Teams</h1>
				<section style={styles.section}>
					<Grid container alignItems="center" justifyContent="space-between">
						<Grid item>
							<h3>Your Student Teams</h3>
						</Grid>
						<Grid item>
							<Button variant="contained" style={styles.addRoundButton}>
								ADD TEAM
							</Button>
						</Grid>
					</Grid>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							rowGap: "20px",
							marginTop: "30px",
						}}
					>
						{loading ? (
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 650 }} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>Team Name</TableCell>
											<TableCell>Your Role</TableCell>
											<TableCell>Owner Email</TableCell>
											<TableCell>Actions</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>{generateSkeletonRows()}</TableBody>
								</Table>
							</TableContainer>
						) : (
							<CommonDashboardTable results={roles}></CommonDashboardTable>
						)}
					</div>
				</section>

				<section style={styles.section}>
					<Grid container alignItems="center" justifyContent="space-between">
						<Grid item>
							<h4>Other Actions</h4>
						</Grid>
						<Grid item>
							<Button
								variant="contained"
								style={{
									backgroundColor: "white",
									color: "black",
									border: "1px solid black",
								}}
							>
								VIEW INTERVIEWS AND CHANGE AVAILABILITY
							</Button>
						</Grid>
					</Grid>
				</section>
			</main>
		</div>
	);
}

export default CommonDashboard;
