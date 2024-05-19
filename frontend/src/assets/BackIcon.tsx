import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import styled from "styled-components";
import theme from "./Theme";

const BackIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(1)};
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  border-color: ${theme.palette.primary.main};
  cursor: pointer;
`;

function BackIcon() {
  return (
    <BackIconWrapper>
      <ArrowBackOutlinedIcon
        color="primary"
        onClick={() => {
          console.log("Back Button working");
        }}
      />
    </BackIconWrapper>
  );
}

export default BackIcon;
