import { Box, Grid2 } from "@mui/material";
import React from "react";
import LoginForm from "../Pages/LoginForm";

function LoginLayout() {
  return (
    <Box>
      <Grid2 container>
        <Grid2 item xs={8}>
          <LoginForm />
        </Grid2>
        <Grid2 item xs={4}>
          <Box>Yen yen yen</Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default LoginLayout;
