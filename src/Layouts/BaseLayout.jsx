import React, { useContext } from "react";
import { Grid2 as Grid } from "@mui/material";
import { LayoutContext } from "../Contexts/LayoutContext";

function BaseLayout() {
  const { navigationPanel, controlPanel, displayPanel } =
    useContext(LayoutContext);

  return (
    <Grid container sx={{ m: 0 }}>
      {navigationPanel}
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid
          item
          sx={{
            p: 2,
            height: "100vh",
            maxWidth: 350,
            minWidth: 300,
            width: "30%",
            bgcolor: "background.paper",
          }}
        >
          {controlPanel}
        </Grid>

        <Grid
          item
          sx={{
            p: 2,
            mx:"auto",
            bgcolor: "background.default",
            width: "70%",
          }}
        >
          {displayPanel}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default BaseLayout;
