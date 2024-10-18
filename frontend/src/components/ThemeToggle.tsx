import { FormControlLabel, Switch } from "@mui/material";
import React from "react";
import { useTheme } from "../util/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <FormControlLabel
      control={<Switch checked={darkMode} onChange={toggleTheme} />}
      label={darkMode ? "Dark Mode" : "Light Mode"}
    />
  );
};

export default ThemeToggle;
