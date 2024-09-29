import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#086cac",
    },
    // secondary: {
    //   main: '#ac4708',
    // },
    // background: {
    //   default: "#ffffff",
    //   paper: "#f5f5f5",
    // },
    // text: {
    //   primary: "#333333",
    //   secondary: "#666666",
    // },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0DA3E9",
    },
    // secondary: {
    //   main: '#ac4708',
    // },
    // background: {
    //   default: "#303030",
    //   paper: "#424242",
    // },
    // text: {
    //   primary: "#ffffff",
    //   secondary: "#b0b0b0",
    // },
  },
});
