// SkeletonLoader.tsx
import React from "react";
import {
	Skeleton,
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from "@mui/material";

interface SkeletonLoaderProps {
	type: "singleRound" | "openings";
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type }) => {
	switch (type) {
		case "singleRound":
			return (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								{[...Array(4)].map((_, index) => (
									<TableCell key={index}>
										<Skeleton variant="text" width={100} />
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								{[...Array(4)].map((_, index) => (
									<TableCell key={index}>
										<Skeleton variant="text" />
									</TableCell>
								))}
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			);
		case "openings":
			return (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>
									<Skeleton variant="text" width={100} />
								</TableCell>
								<TableCell>
									<Skeleton variant="text" width={100} />
								</TableCell>
								<TableCell>
									<Skeleton variant="text" width={200} />
								</TableCell>
								<TableCell>
									<Skeleton variant="rectangular" width={80} height={30} />
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{[...Array(4)].map((_, index) => (
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
										<Skeleton variant="rectangular" width={80} height={30} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			);
		default:
			return null;
	}
};
