import { useState, useEffect } from "react";
import { Typography, Button, CircularProgress, IconButton, Skeleton } from "@mui/material";
import styled from "styled-components";
import BackIcon from "../assets/BackIcon";
import { OpeningsTable, openingsResultProps } from "../components/OpeningsTable";
import axios from "axios";
import { SingleRoundTable, SingleRoundResultProps } from "../components/SingleRoundTable";
import { useLocation, useNavigate } from "react-router-dom";
import { SkeletonLoader } from "../components/RecruitmentSkeleton";

const HeadWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const TitleWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`;

const OpeningsWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	top: 10px;
`;

function RecruitmentRoundDetailsPage() {
	const [rounds, setRounds] = useState<SingleRoundResultProps[]>([]);
	const [openings, setOpening] = useState<openingsResultProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const state = location.state as {
		recruitment_round_id: number;
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const roundsResponse = await axios.get(
					`http://127.0.0.1:3000/recruitmentRounds/${state.recruitment_round_id}`
				);
				const openingsResponse = await axios.get(
					`http://127.0.0.1:3000/recruitmentRounds/${state.recruitment_round_id}/openings`
				);
				setRounds(roundsResponse.data);
				setOpening(openingsResponse.data);

				await new Promise((resolve) => setTimeout(() => resolve("resolved"), 5000));
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [state.recruitment_round_id]);

	const updateStatus = async (statusChange: string) => {
		setIsUpdating(true);
		const data = {
			status: statusChange,
		};
		try {
			await axios.patch(
				`http://127.0.0.1:3000/recruitmentRounds/${state.recruitment_round_id}/status`,
				data
			);
			alert("Status updated successfully!");
		} catch (error) {
			console.error("Error archiving round:", error);
			alert("Failed to update status");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleAddOpening = () => {
		navigate("/create-opening", {
			state: {
				deadline: rounds[0].deadline,
				roundId: rounds[0]?.id,
				round: rounds[0]?.student_team_name + " " + rounds[0]?.id,
			},
		});
	};

	const handleView = (
		id: number,
		recruitment_round_id: number,
		student_team_name: string,
		title: string,
		application_count: number
	) => {
		navigate("/viewopen", {
			state: {
				id,
				recruitment_round_id,
				student_team_name,
				title,
				application_count,
			},
		});
	};

	return (
		<>
			<HeadWrapper>
				<TitleWrapper>
					<IconButton onClick={() => navigate("/viewrecruitmentround")}>
						{loading ? <Skeleton variant="circular" width={40} height={40} /> : <BackIcon />}
					</IconButton>
					<Typography variant="h5">
						{loading ? (
							<Skeleton width={200} />
						) : (
							`${rounds[0]?.student_team_name} ${rounds[0]?.id}`
						)}
					</Typography>
				</TitleWrapper>
				{loading ? (
					<Skeleton variant="rectangular" width={150} height={40} />
				) : rounds[0]?.status === "A" ? (
					<Button
						variant="outlined"
						style={{
							color: "black",
							backgroundColor: "white",
							borderColor: "black",
							borderWidth: "1px",
						}}
						disabled={isUpdating}
						onClick={() => {
							updateStatus("R");
						}}
					>
						{isUpdating ? <CircularProgress size={24} /> : "Archive Round and Send Results"}
					</Button>
				) : (
					<Button
						variant="contained"
						onClick={() => {
							updateStatus("A");
						}}
					>
						{isUpdating ? (
							<CircularProgress size={24} style={{ color: "white" }} />
						) : (
							"Activate Round"
						)}
					</Button>
				)}
			</HeadWrapper>

			<div style={{ marginTop: "40px" }}>
				{loading ? <SkeletonLoader type="singleRound" /> : <SingleRoundTable results={rounds} />}
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					rowGap: "20px",
					marginTop: "100px",
				}}
			>
				<OpeningsWrapper>
					<Typography variant="h6">
						{loading ? <Skeleton width={200} /> : "Recruitment Round Openings"}
					</Typography>

					{loading ? (
						<Skeleton variant="rectangular" width={150} height={40} />
					) : (
						<Button variant="contained" onClick={handleAddOpening} disabled={loading}>
							Add Opening
						</Button>
					)}
				</OpeningsWrapper>
				{loading ? (
					<SkeletonLoader type="openings" />
				) : (
					<OpeningsTable results={openings} viewHandler={handleView} />
				)}
			</div>
		</>
	);
}

export default RecruitmentRoundDetailsPage;
