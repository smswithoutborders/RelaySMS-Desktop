import { Box, Button, Grid, TextField, Typography, Link } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

function LoginForm() {
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
              Login
            </Typography>
            <Typography variant="h6" sx={{ py: 5, textAlign: "center" }}>
              Do not have an account?{" "}
              <Link
                component={RouterLink}
                to="/signup"
                sx={{
                  color: "background.more",
                  textDecoration: "none",
                  fontWeight: "bold",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign Up
              </Link>
            </Typography>
            <MuiTelInput
              fullWidth
              variant="standard"
              defaultCountry="CM"
              sx={{ py: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              variant="standard"
              sx={{ mt: 8 }}
            />
            <Typography
              variant="h6"
              sx={{ pt: 5, color: "background.more" }}
            >
              Forgot Password?
            </Typography>
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
                  textTransform: "none"
                }}
              >
                Login
              </Button>
            </Box>
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
                  to="/bridge-auth"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Authenticate Offline
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
                borderRadius: 7
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginForm;
