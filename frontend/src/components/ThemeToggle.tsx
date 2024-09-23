import React from "react";
import { Switch, FormControlLabel } from "@mui/material";
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
