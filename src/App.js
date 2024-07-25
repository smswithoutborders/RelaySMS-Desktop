import * as React from "react";
import "./App.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Onboarding from "./Pages/Onboarding";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import Landing from "./Pages/Home";
import Settings from "./Pages/Settings";
import "./i18n";
import Onboarding2 from "./Pages/Onboarding2";
import Onboarding3 from "./Pages/Onboarding3";
import Onboarding4 from "./Pages/Onboarding4";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import SecuritySettings from "./Pages/SecuritySetting";
import AdvancedSettings from "./Pages/AdvancedSettings";

const isElectron = () => {
  return (
    typeof window !== "undefined" &&
    window.process &&
    window.process.type === "renderer"
  );
};

let ipcRenderer;
if (isElectron()) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [onboardingStep, setOnboardingStep] = React.useState(null);

  const handleCompleteOnboarding = (step) => {
    if (isElectron()) {
      ipcRenderer
        .invoke("store-onboarding-step", step)
        .then(() => {
          setOnboardingStep(step);
        })
        .catch((error) => {
          console.error("Error setting onboarding status:", error);
        });
    } else {
      localStorage.setItem("onboardingStep", JSON.stringify({ step }));
      setOnboardingStep(step);
    }
  };

  React.useEffect(() => {
    if (isElectron()) {
      ipcRenderer
        .invoke("retrieve-onboarding-step")
        .then((step) => {
          setOnboardingStep(step);
        })
        .catch((error) => {
          console.error("Error retrieving onboarding status:", error);
          setOnboardingStep(0);
        });
    } else {
      const savedStep = localStorage.getItem("onboardingStep");
      setOnboardingStep(savedStep ? JSON.parse(savedStep).step : 0);
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
            paper: prefersDarkMode ? "#002244" : "#4682B4",
          },
          text: {
            primary: prefersDarkMode ? "#fff" : "#000",
            secondary: prefersDarkMode ? "#b0b0b0" : "#333",
          },
        },
      }),
    [prefersDarkMode]
  );

  if (onboardingStep === null) {
    return null; // Or a loading spinner
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route path="/messages" element={<Landing />} />
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
                      : onboardingStep === 2
                      ? "/onboarding3"
                      : onboardingStep === 3
                      ? "/onboarding4"
                      : "/messages"
                  }
                  replace
                />
              )
            }
          />
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
          <Route
            path="/onboarding3"
            element={
              <Onboarding3 onComplete={() => handleCompleteOnboarding(3)} />
            }
          />
          <Route
            path="/onboarding4"
            element={
              <Onboarding4 onComplete={() => handleCompleteOnboarding(4)} />
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/securitysettings" element={<SecuritySettings />} />
          <Route path="/advancedsettings" element={<AdvancedSettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
