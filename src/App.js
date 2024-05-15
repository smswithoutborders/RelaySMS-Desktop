import * as React from "react";
import "./App.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Onboarding from "./Pages/Onboarding";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import IntroducingVaults from "./Pages/IntroducingVaults";
import Done from "./Pages/Done";
import Landing from "./Pages/Home";
import LoginSignupPage from "./Pages/Login";
import Settings from "./Pages/Settings";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [completedOnboarding, setCompletedOnboarding] = React.useState(false);

  React.useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    if (onboardingCompleted) {
      setCompletedOnboarding(true);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem("onboardingCompleted", "true");
    setCompletedOnboarding(true);
  };

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#BD9BC9",
            paper: "#4e3e53",
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
          <Route path="/messages" element={<Landing />} />
          <Route
            path="/"
            element={
              completedOnboarding ? (
                <Navigate to="/messages" replace />
              ) : (
                <Onboarding onComplete={handleCompleteOnboarding} />
              )
            }
          />
          <Route path="/" element={<Onboarding />} />
          <Route path="/vaultsonboarding" element={<IntroducingVaults />} />
          <Route path="/done" element={<Done />} />
          <Route path="/login" element={<LoginSignupPage />} />
          <Route path="/settings" element={<Settings />} />
          {/* <Route path="/messages/:id" element={<Message />} /> */}
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
