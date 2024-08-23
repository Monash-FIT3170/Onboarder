import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import {
  DashboardTable,
  DashboardTableProps,
  StudentTeamResultProps,
} from "../components/DashboardTable";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import JobInterviewIcon from "../assets/JobInterview.jpg";

const TitleWrap = styled.div`
  margin: auto;
  text-align: center;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  width: 100%;
`;

const StyledCard = styled(Card)`
  max-width: 250px;
  text-align: center;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
`;

const StyledCardMedia = styled(CardMedia)`
  height: 160px;
  width: 250px;
  object-fit: contain;
  padding: 16px;
`;

const data1: StudentTeamResultProps = {
  team_name: "Monash Rova",
  role: "Owner",
  owner_info: "You",
};

const mockData: DashboardTableProps = {
  results: [data1, data1, data1, data1, data1],
};

const Dashboard = () => {
  const navigate = useNavigate();

  const handleInterviewCardClick = () => {
    navigate("/interviews");
  };

  return (
    <Box display="flex" flexDirection="column">
      <TitleWrap>
        <Typography variant="h2" fontWeight="light" gutterBottom>
          Student Team
        </Typography>
      </TitleWrap>
      <Typography variant="h4" style={{ marginBottom: "20px" }}>
        Your student teams
      </Typography>
      <DashboardTable results={mockData.results} />
      <CardContainer>
        <StyledCard>
          <CardActionArea onClick={handleInterviewCardClick}>
            <StyledCardMedia image={JobInterviewIcon} />
            <CardContent>
              <Typography variant="h5" component="div">
                Interviews
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View interviews and manage your availability
              </Typography>
            </CardContent>
          </CardActionArea>
        </StyledCard>
      </CardContainer>
    </Box>
  );
};

export default Dashboard;
