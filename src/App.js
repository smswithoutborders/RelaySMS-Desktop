import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";

import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { LayoutProvider } from "./Contexts/LayoutContext";
import {
  AuthenticationProvider,
  useAuth,
} from "./Contexts/AuthenticationContext";
import { CssBaseline } from "@mui/material";
import { PlatformLayout, BridgeLayout } from "./Layouts";
import {
  AuthPage,
  SignupPage,
  BridgeAuthPage,
  ResetPasswordPage,
} from "./Pages";

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
            more: prefersDarkMode ? "#0C4B94" : "#0C4B94",
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
            <AppRoutes />
          </HashRouter>
        </LayoutProvider>
      </AuthenticationProvider>
    </ThemeProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated, AuthRequired } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthRequired>
            <PlatformLayout />
          </AuthRequired>
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated() ? <Navigate to="/" replace={true} /> : <AuthPage />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated() ? (
            <Navigate to="/" replace={true} />
          ) : (
            <SignupPage />
          )
        }
      />
      <Route
        path="/reset-password"
        element={
          isAuthenticated() ? (
            <Navigate to="/" replace={true} />
          ) : (
            <ResetPasswordPage />
          )
        }
      />
      <Route path="/bridge-auth" element={<BridgeAuthPage />} />
      <Route path="*" element={<Navigate to="/" replace={true} />} />
    </Routes>
  );
}

export default App;
