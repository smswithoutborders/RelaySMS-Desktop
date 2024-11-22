import { Info } from "@mui/icons-material";
import {
  Button,
  Grid2 as Grid,
  Typography,
  Link,
  Alert,
  Box,
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

function BridgeAuthPage() {
  return (
    <Grid container height="100vh" justifyContent="center" alignItems="center">
      <Grid
        size={8}
        display="flex"
        height="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        sx={{
          py: 5,
          px: { xs: 5, md: 15 },
          overflowY: "auto",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 8 }}>
          Authenticate Offline
        </Typography>
        <Typography variant="h6" sx={{ mb: 5 }}>
          RelaySMS provides flexibility (Relay Bridges), letting you publish
          messages without having an account. Messages remain encrypted and
          secure.
        </Typography>
        <Alert severity="info" sx={{ mb: 5, maxWidth: "500px" }}>
          When you click the button below, we will send you an authentication
          code. Ensure you have an active modem connected or a valid SIM card in
          your device.
        </Alert>
        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 2,
            borderRadius: 7,
            width: "50%",
            bgcolor: "background.more",
            color: "white",
            "&:hover": {
              bgcolor: "primary.main",
              color: "black",
            },
          }}
        >
          Get Authentication Code
        </Button>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <Link
              href="#"
              underline="hover"
              display="inline-flex"
              alignItems="center"
              color="background.more"
            >
              Learn more about Relay Bridges{" "}
              <Info fontSize="10px" sx={{ ml: 1 }} />
            </Link>
          </Typography>
          <Typography variant="h6" sx={{ mt: 10 }}>
            <Link component={RouterLink} to="/login" underline="always">
              Login
            </Link>
          </Typography>
        </Box>
      </Grid>

      <Grid
        size={4}
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          bgcolor: "background.paper",
          p: 2,
          overflowY: "auto",
        }}
      >
        <img
          src="login.png"
          alt="login illustration"
          style={{ width: "100%", height: "auto" }}
        />
      </Grid>
    </Grid>
  );
}

export default BridgeAuthPage;
