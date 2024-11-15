import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, HashRouter } from "react-router-dom";

import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { LayoutProvider } from "./Contexts/LayoutContext";
import PlatformLayout from "./Layouts/PlatformLayout";
import { CssBaseline } from "@mui/material";
import LoginLayout from "./Layouts/LoginLayout";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    if (prefersDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [prefersDarkMode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: prefersDarkMode ? "#fff" : "#000",
          },
          background: {
            default: prefersDarkMode ? "#1E1E1E" : "#fafafa",
            paper: prefersDarkMode ? "#000" : "#fff",
            custom: prefersDarkMode ? "#232226" : "#E0E2DB",
            side: prefersDarkMode ? "#171614" : "#fff",
          },
          text: {
            primary: prefersDarkMode ? "#fff" : "#000",
            secondary: prefersDarkMode ? "#b0b0b0" : "#333",
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LayoutProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<PlatformLayout />} />
            <Route path="/login" element={<LoginLayout />} />
          </Routes>
        </HashRouter>
      </LayoutProvider>
    </ThemeProvider>
  );
}

export default App;
