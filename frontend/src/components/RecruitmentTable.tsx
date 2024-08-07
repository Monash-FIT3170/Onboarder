import { TableRow, TableCell, Button } from "@mui/material";

enum Status {
	A = "Active",
	I = "Inactive",
	R = "Archived",
}

interface RecruitmentRound {
	id: number;
	student_team_name: string;
	deadline: string;
	status: keyof typeof Status;
	semester: string;
	year: number;
	openings_count: number;
}

interface RecruitmentTableProps {
	data: RecruitmentRound[];
	filterData: (round: RecruitmentRound) => boolean;
	handleViewRound: (id: number) => void;
	includeViewButton: boolean;
}

const formatDeadline = (deadline: Date) => {
	return `${deadline.getDate().toString().padStart(2, "0")}/${(deadline.getMonth() + 1)
		.toString()
		.padStart(2, "0")}/${deadline.getFullYear()} ${deadline
		.getHours()
		.toString()
		.padStart(2, "0")}:${deadline.getMinutes().toString().padStart(2, "0")}`;
};

const RecruitmentTable: React.FC<RecruitmentTableProps> = ({
	data,
	filterData,
	handleViewRound,
	includeViewButton,
}) => {
	return (
		<>
			{data.filter(filterData).map((item) => {
				const deadline = new Date(item.deadline);
				const formattedDeadline = formatDeadline(deadline);
				return (
					<TableRow key={item.id}>
						<TableCell>{item.student_team_name + " " + item.id}</TableCell>
						<TableCell>{formattedDeadline}</TableCell>
						<TableCell>{Status[item.status] || "Unknown Status"}</TableCell>
						<TableCell>{item.semester}</TableCell>
						<TableCell>{item.year}</TableCell>
						<TableCell>{item.openings_count}</TableCell>
						{includeViewButton && (
							<TableCell>
								<Button
									variant="contained"
									style={{ padding: 0 }}
									onClick={() => handleViewRound(item.id)}
								>
									VIEW
								</Button>
							</TableCell>
						)}
					</TableRow>
				);
			})}
		</>
	);
};

export default RecruitmentTable;
