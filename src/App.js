import React, { useEffect } from "react";
import "./App.css";
import {
  Routes,
  Route,
  HashRouter,
  Navigate,
  useNavigate,
} from "react-router-dom";

import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { LayoutProvider } from "./Contexts/LayoutContext";
import {
  AuthenticationProvider,
  useAuth,
} from "./Contexts/AuthenticationContext";
import { CssBaseline } from "@mui/material";
import { PlatformLayout, LoginLayout } from "./Layouts";

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
      <AuthenticationProvider>
        <LayoutProvider>
          <HashRouter>
            <NavigationHandler />
            <AppRoutes />
          </HashRouter>
        </LayoutProvider>
      </AuthenticationProvider>
    </ThemeProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<PlatformLayout />} />
      <Route path="/login" element={<LoginLayout />} />
      <Route path="*" element={<Navigate to="/" replace={true} />} />
    </Routes>
  );
}

function NavigationHandler() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return null;
}

export default App;
