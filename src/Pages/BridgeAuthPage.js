import React, { useState, useEffect } from "react";
import { Info } from "@mui/icons-material";
import {
  Button,
  Grid2 as Grid,
  Typography,
  Link,
  Alert as MuiAlert,
  Box,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { OTPDialog } from "../Components";

import {
  createBridgeEntity,
  fetchLatestMessageWithOtp,
  fetchModems,
} from "../controllers";

function BridgeAuthPage() {
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [modemsAvailable, setModemsAvailable] = useState(false);

  const checkModems = async () => {
    const modems = await fetchModems();
    setModemsAvailable(modems.length > 0);
  };

  useEffect(() => {
    checkModems();
  }, []);

  const handleSubmit = async (event) => {
    event?.preventDefault();

    await checkModems();

    setLoading(true);

    try {
      const { err, res } = await createBridgeEntity({});
      if (err) {
        setAlert({
          open: true,
          type: "error",
          message: err,
        });
        return;
      }
      setAlert({
        open: true,
        type: "success",
        message: res.message,
      });
      setOtpDialogOpen(true);
    } catch (error) {
      setAlert({
        open: true,
        type: "error",
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (setOtpAlert, otp) => {
    try {
      const { err } = await createBridgeEntity({
        ownershipProofResponse: otp,
      });
      if (err) {
        setOtpAlert({
          severity: "error",
          message: err,
        });
        return;
      }
      setOtpDialogOpen(false);
      await window.api.invoke("reload-window");
    } catch (error) {
      setOtpAlert({
        severity: "error",
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  const handleOpenExternalLink = (url) => {
    window.api.send("open-external-link", url);
  };

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
        <MuiAlert severity="info" sx={{ mb: 5, maxWidth: "500px" }}>
          When you click the button below, we will send you an authentication
          code. Ensure you have an active modem connected or a valid SIM card in
          your device.
        </MuiAlert>

        <Snackbar
          open={alert.open}
          autoHideDuration={4000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            severity={alert.type}
            sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}
          >
            {alert.message}
          </MuiAlert>
        </Snackbar>

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
          onClick={handleSubmit}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : null
          }
        >
          Get Authentication Code
        </Button>

        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 2, borderRadius: 7, color: "primary", width: "40%" }}
          disabled={loading}
          onClick={async () => {
            await checkModems();
            setOtpDialogOpen(true);
          }}
        >
          Already have an Authentication Code? Click here.
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              color: "background.more",
              cursor: "pointer",
              alignItems: "center",
              display: "inline-flex",
            }}
            onClick={() =>
              handleOpenExternalLink(
                "https://blog.smswithoutborders.com/posts/Bridges"
              )
            }
          >
            Learn more about Relay Bridges{" "}
            <Info fontSize="14px" sx={{ ml: 1 }} />
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
          src="images/login.png"
          alt="login illustration"
          style={{ width: "100%", height: "auto" }}
        />
      </Grid>

      <OTPDialog
        type="text"
        fullWidth={true}
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        onSubmit={handleOtpSubmit}
        onResend={handleSubmit}
        event={{
          ...(modemsAvailable && {
            callback: async () => {
              const phoneNumbers = ["+15024439537"];
              const messagePatterns = [/RelaySMS.*?(\d+)\s+(\S+)/i];

              const { err, message } = await fetchLatestMessageWithOtp({
                phoneNumbers,
                messagePatterns,
              });

              if (err) {
                setAlert({
                  open: true,
                  type: "error",
                  message: err,
                });
                return;
              }
              return message?.otp;
            },
            interval: 10000,
          }),
        }}
      />
    </Grid>
  );
}

export default BridgeAuthPage;
