import { Info } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Typography,
  Link,
  Alert,
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

function BridgeAuth() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        container
        columnSpacing={4}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item md={8} xs={8}>
          <Box component="form" sx={{ px: 15 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 600, py: 2, textAlign: "center" }}
            >
              Authenticate Offline
            </Typography>
            <Typography variant="h6" sx={{ py: 5, textAlign: "center" }}>
              RelaySMS provides flexibility (Relay Bridges), letting you publish
              messages without having an account. Still Encrypted and secure.
            </Typography>

            <Alert severity="info" sx={{py: 3}}>
              When you click the button below we will send you an authentication
              code, so make sure you have an active modem connected or an active
              sim card in your laptop.
            </Alert>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 7,
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "background.more",
                  color: "white",
                  borderRadius: 7,
                  px: 15,
                  py: 2,
                  textTransform: "none",
                }}
              >
                Get Authentification Code
              </Button>
            </Box>
            <Typography
              variant="h6"
              sx={{ py: 5, textAlign: "center", color: "background.more" }}
            >
              learn more about Relay Bridges <Info />
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 15,
              }}
            >
              <Typography variant="h6" sx={{ textDecoration: "underline" }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid
          item
          xs={4}
          md={4}
          sx={{
            bgcolor: "background.paper",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            px: 8,
          }}
        >
          <Box>
            <Box
              component="img"
              src="https://img.freepik.com/premium-vector/qr-code-isolated-white-background-universal-product-scan-code-doodle-style-vector-icon-design-element-hand-drawn_186802-2493.jpg?ga=GA1.2.2003631022.1724151815&semt=ais_hybrid"
              alt="qr code"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 7,
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default BridgeAuth;
