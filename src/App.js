import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";

import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { LayoutProvider } from "./Contexts/LayoutContext";
import {
  AuthenticationProvider,
  useAuth,
} from "./Contexts/AuthenticationContext";
import { CssBaseline, CircularProgress, Box } from "@mui/material";
import { PlatformLayout, BridgeLayout, DekuLayout } from "./Layouts";
import {
  AuthPage,
  SignupPage,
  BridgeAuthPage,
  ResetPasswordPage,
} from "./Pages";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", prefersDarkMode);
  }, [prefersDarkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: { main: prefersDarkMode ? "#fff" : "#000" },
          background: {
            default: prefersDarkMode ? "#1E1E1E" : "#fafafa",
            paper: prefersDarkMode ? "#000" : "#fff",
            custom: prefersDarkMode ? "#232226" : "#E0E2DB",
            side: prefersDarkMode ? "#171614" : "#fff",
            more: "#0C4B94",
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
  const { AuthRequired, hasLongLivedToken, hasBridgeAuthorizationCode } =
    useAuth();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthRequired>
            {hasLongLivedToken() ? (
              <PlatformLayout />
            ) : hasBridgeAuthorizationCode ? (
              <BridgeLayout />
            ) : (
              <Navigate to="/login" replace />
            )}
          </AuthRequired>
        }
      />
      <Route
        path="/login"
        element={
          hasLongLivedToken() ? <Navigate to="/" replace /> : <AuthPage />
        }
      />
      <Route
        path="/signup"
        element={
          hasLongLivedToken() ? <Navigate to="/" replace /> : <SignupPage />
        }
      />
      <Route
        path="/reset-password"
        element={
          hasLongLivedToken() ? (
            <Navigate to="/" replace />
          ) : (
            <ResetPasswordPage />
          )
        }
      />
      <Route path="/bridge-auth" element={<BridgeAuthPage />} />
      <Route path="/deku" element={<DekuLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
