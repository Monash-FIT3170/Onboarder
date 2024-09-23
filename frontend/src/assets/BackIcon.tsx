import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import styled from "styled-components";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../util/ThemeContext";

const BackIconWrapper = styled.div<{ theme: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing(1)};
  width: ${(props) => props.theme.spacing(4)};
  height: ${(props) => props.theme.spacing(4)};
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  border-color: ${(props) => props.theme.palette.primary.main};
  cursor: pointer;
`;

function BackIcon() {
  const { darkMode } = useTheme();
  const theme = useMuiTheme(); // This gets the current MUI theme

  return (
    <BackIconWrapper theme={theme}>
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
