import React, { useContext } from "react";
import { Grid2 as Grid } from "@mui/material";
import { LayoutContext } from "../Contexts/LayoutContext";

function BaseLayout() {
  const { navigationPanel, controlPanel, displayPanel } =
    useContext(LayoutContext);

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
          item
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
          item
          sx={{
            p: 2,
            px: 10,
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
