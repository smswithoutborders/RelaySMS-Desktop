import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";

import { LayoutProvider } from "./Contexts/LayoutContext";
import {
  AuthenticationProvider,
  useAuth,
} from "./Contexts/AuthenticationContext";
import { ThemeModeProvider } from "./Contexts/ThemeContext";
import { LanguageProvider } from "./Contexts/LanguageContext";
import { CssBaseline, CircularProgress, Box } from "@mui/material";
import { PlatformLayout, BridgeLayout, DekuLayout } from "./Layouts";
import {
  AuthPage,
  SignupPage,
  BridgeAuthPage,
  ResetPasswordPage,
} from "./Pages";

function App() {
  return (
    <LanguageProvider>
      <ThemeModeProvider>
        <CssBaseline />
        <AuthenticationProvider>
          <LayoutProvider>
            <HashRouter>
              <AppRoutes />
            </HashRouter>
          </LayoutProvider>
        </AuthenticationProvider>
      </ThemeModeProvider>
    </LanguageProvider>
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
      <Route
        path="/bridge-auth"
        element={
          hasLongLivedToken() || hasBridgeAuthorizationCode ? (
            <Navigate to="/" replace />
          ) : (
            <BridgeAuthPage />
          )
        }
      />
      <Route path="/deku" element={<DekuLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
