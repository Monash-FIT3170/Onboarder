import { createTheme } from "@mui/material/styles";

const baseTheme = {
  typography: {
    fontFamily: "sans-serif",
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
});
