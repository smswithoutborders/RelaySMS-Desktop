import * as React from "react";
import { useEffect } from "react";
import "./App.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import Landing from "./Pages/Home";
import Onboarding from "./Pages/Onboarding";
import Onboarding2 from "./Pages/Onboarding2";
import "./i18n";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [onboardingStep, setOnboardingStep] = React.useState(0);

  const handleCompleteOnboarding = (step) => {
    setOnboardingStep(step);
  };

  useEffect(() => {
    const isFirstTime = localStorage.getItem("firstTimeUser");
    if (!isFirstTime) {
      setOnboardingStep(true);
      localStorage.setItem("firstTimeUser", "false");
    }
  }, []);

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
            paper: prefersDarkMode ? "#0D3B66" : "#98C1D9",
            custom: prefersDarkMode ? "#000" : "#fff",
            side: prefersDarkMode ? "#0D3B66" : "#98C1D9",
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
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={
              onboardingStep >= 4 ? (
                <Navigate to="/messages" replace />
              ) : (
                <Navigate
                  to={
                    onboardingStep === 0
                      ? "/onboarding"
                      : onboardingStep === 1
                      ? "/onboarding2"
                      : "/messages"
                  }
                  replace
                />
              )
            }
          />
          <Route path="/messages" element={<Landing />} />
          <Route
            path="/onboarding"
            element={
              <Onboarding onComplete={() => handleCompleteOnboarding(1)} />
            }
          />
          <Route
            path="/onboarding2"
            element={
              <Onboarding2 onComplete={() => handleCompleteOnboarding(2)} />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
