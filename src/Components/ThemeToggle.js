import React from "react";
import { Switch, Box, Typography } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useThemeMode } from "../Contexts/ThemeContext";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box display="flex" alignItems="center" sx={{ml: 2}}>
        <Typography variant="body1">Theme Toggle</Typography>
      <Switch
        checked={mode === "dark"}
        onChange={toggleTheme}
        color="primary"
        inputProps={{ "aria-label": "Theme toggle" }}
        icon={<LightModeIcon sx={{ fontSize: 30, color: "#E09F3E" }} />}
        checkedIcon={<DarkModeIcon sx={{ fontSize: 30, }} />}
        
      />
    </Box>
  );
};

export default ThemeToggle;
