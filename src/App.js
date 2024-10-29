import * as React from "react";
import { useEffect } from "react";
import "./App.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import Landing from "./Pages/Home";
import OnboardingContainer from "./OnboardingCon";
import "./i18n"; 

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [onboardingStep, setOnboardingStep] = React.useState(0);
  const [isFirstTime, setIsFirstTime] = React.useState(true);

  useEffect(() => {
    const firstTimeUser = localStorage.getItem("firstTimeUser");
    if (firstTimeUser) {
      setIsFirstTime(true); 
    }
  }, []);

  const handleNext = () => {
    setOnboardingStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setOnboardingStep((prevStep) => prevStep - 1);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("firstTimeUser", "true");
    setIsFirstTime(false);
  };

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
      <HashRouter>
        <Routes>
          {isFirstTime ? (
            <Route
              path="/onboarding"
              element={
                <OnboardingContainer
                  handleNext={handleNext}
                  handleBack={handleBack}
                  handleOnboardingComplete={handleOnboardingComplete}
                  isNextDisabled={onboardingStep === 0}
                />
              }
            />
          ) : (
            <Route path="/messages" element={<Landing />} />
          )}
          <Route path="*" element={<Navigate to={isFirstTime ? "/onboarding" : "/messages"} replace />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
