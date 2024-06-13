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

const storage = isElectron()
  ? require("electron-json-storage")
  : {
      get: (key, callback) => {
        const data = localStorage.getItem(key);
        callback(null, data ? JSON.parse(data) : {});
      },
      set: (key, json, callback) => {
        localStorage.setItem(key, JSON.stringify(json));
        callback(null);
      },
    };

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [onboardingStep, setOnboardingStep] = React.useState(null);

  const handleCompleteOnboarding = (step) => {
    storage.set("onboardingStep", { step }, (error) => {
      if (error) {
        console.error("Error setting onboarding status:", error);
        return;
      }
      console.log(`Onboarding step set to ${step}.`);
      setOnboardingStep(step);
    });
  };

  React.useEffect(() => {
    storage.get("onboardingStep", (error, data) => {
      if (error) {
        console.error("Error retrieving onboarding status:", error);
        return;
      }
      console.log("Onboarding status retrieved:", data);
      if (data && data.step !== undefined) {
        setOnboardingStep(data.step);
      } else {
        setOnboardingStep(0);
      }
    });
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: prefersDarkMode ? "#fff" : "#000", // White in dark mode, black in light mode
          },
          background: {
            default: prefersDarkMode ? "#1E1E1E" : "#fafafa",
            paper: prefersDarkMode ? "#171717" : "#F2F2F2",
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
    console.log("Onboarding step is null, showing loading state.");
    return null; // Or a loading spinner
  }

  console.log("Rendering app with onboardingStep:", onboardingStep);

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
