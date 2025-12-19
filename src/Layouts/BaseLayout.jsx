import { useState, useEffect } from "react";
import { Grid2 as Grid, CircularProgress, Box } from "@mui/material";
import { useLayout } from "../Contexts/LayoutContext";

function BaseLayout() {
  const { navigationPanel, displayPanel } = useLayout();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
    <Grid container sx={{ height: "100vh", overflowY: "hidden"}}>
      <Grid md={3}>{navigationPanel}</Grid>
      <Grid
        md={9}
        sx={{
          p: 2,
          px: 10,
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
  );
}

export default BaseLayout;
