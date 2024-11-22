import { useState, useEffect } from "react";
import { Grid2 as Grid, CircularProgress, Box } from "@mui/material";
import { useLayout } from "../Contexts/LayoutContext";

function BaseLayout() {
  const { navigationPanel, controlPanel, displayPanel } = useLayout();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
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
    <Grid
      container
      sx={{
        m: 0,
        height: "100vh",
        flexDirection: "row",
        flexWrap: "nowrap",
      }}
    >
      {navigationPanel}
      <Grid
        container
        sx={{
          flexGrow: 1,
          flexDirection: "row",
          flexWrap: "nowrap",
          transition: "flex 0.3s ease",
        }}
      >
        <Grid
          sx={{
            p: 2,
            height: "100%",
            flex: "1 1 30%",
            maxWidth: 350,
            minWidth: 300,
            bgcolor: "background.paper",
            transition: "flex 0.3s ease",
          }}
        >
          {controlPanel}
        </Grid>

        <Grid
          sx={{
            p: 2,
            px: 10,
            maxWidth: 1050,
            mx: "auto",
            height: "100%",
            flex: "1 1 70%",
            bgcolor: "background.default",
            transition: "flex 0.3s ease",
          }}
        >
          {displayPanel}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default BaseLayout;
