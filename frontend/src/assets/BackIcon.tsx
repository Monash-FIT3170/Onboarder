import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import styled from "styled-components";

const BackIconWrapper = styled.div`
  padding: theme.spacing(1.5);
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  border-color: blue;
  cursor: pointer;
`;

function BackIcon() {
  return (
    <BackIconWrapper>
      <ArrowBackOutlinedIcon
        onClick={() => {
          console.log("BRUH");
        }}
      />
    </BackIconWrapper>
  );
}

export default BackIcon;
