import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Dialog,
  Typography,
  Alert,
  Snackbar,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import { FaInfoCircle } from "react-icons/fa";

function generateKeyPair() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    secretKey: naclUtil.encodeBase64(keyPair.secretKey),
  };
}

function Bridges({ onClose, open, asDialog, anchorEl }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    setOtpOpen(false);
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const requestOtp = async () => {
    setLoading(true);

    try {
      const clientPublishKeyPair = generateKeyPair();
      await window.api.storeParams(
        "client_publish_key_pair",
        clientPublishKeyPair
      );

      const payload = await window.api.bridgePayload({
        contentSwitch: 0,
        pub_key: clientPublishKeyPair.publicKey,
      });
      const number = "+237679466332";

      console.log("Prepared SMS with payload:", payload, "and number:", number);
      await window.api.sendSMS({ text: payload, number });
      setAlert({
        message: "OTP request sent successfully",
        severity: "success",
        open: true,
      });
      setOtpOpen(true);

      retrieveMessages();
    } catch (error) {
      setAlert({ message: error.message, severity: "error", open: true });
    } finally {
      setLoading(false);
    }
  };

  const retrieveMessages = async () => {
    try {
      const messages = await window.api.recieveSMS();
      const otpMessage = messages.find((msg) =>
        msg.includes("Your RelaySMS code is")
      );

      if (otpMessage) {
        const otpCode = otpMessage.match(/\d+/)[0];
        setOtp(otpCode);
        setAlert({
          message: `OTP received: ${otpCode}`,
          severity: "info",
          open: true,
        });
      }
    } catch (error) {
      console.error("Failed to retrieve messages:", error);
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);

    try {
      const clientPublishKeyPair = await window.api.retrieveParams(
        "client_publish_key_pair"
      );
      const payload = await window.api.bridgePayload({
        contentSwitch: 1,
        pub_key: otp,
      });

      await window.api.authenticate(payload, clientPublishKeyPair.publicKey);

      setAlert({
        message: "Authentication successful!",
        severity: "success",
        open: true,
      });
      setTimeout(() => {
        navigate("/messages");
        handleClose();
      }, 2000);
    } catch (error) {
      setAlert({ message: error.message, severity: "error", open: true });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenExternalLink = (url) => {
    window.api.openExternalLink(url);
  };

  const content = (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <Typography
        align="center"
        variant="body1"
        sx={{ pt: 4, fontWeight: 600 }}
      >
        {t("continueWithoutAccount")}
      </Typography>

      <Typography align="center" variant="body2" sx={{ py: 4 }}>
        {t("continueWithoutAccountSub")}
      </Typography>

      <Button
        variant="contained"
        disabled={loading}
        onClick={requestOtp}
        sx={{ width: "100%", mb: 2, borderRadius: 5, textTransform: "none" }}
      >
        {loading ? "Loading..." : t("getAuthCode")}
      </Button>

      <Typography
        align="center"
        color="#347FC4"
        variant="body2"
        sx={{ pt: 2, fontSize: "12px", cursor: "pointer" }}
        onClick={() =>
          handleOpenExternalLink("https://blog.smswithoutborders.com")
        }
      >
        {t("continueWithoutAccountmore")} <FaInfoCircle />
      </Typography>

      <Dialog open={otpOpen} onClose={() => setOtpOpen(false)}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            {t("enterOTP")}
          </Typography>
          <TextField
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            label="OTP Code"
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            onClick={handleOtpSubmit}
          >
            {loading ? "Verifying..." : t("submitOTP")}
          </Button>
        </Box>
      </Dialog>
    </>
  );

  return asDialog ? (
    <Dialog open={open} anchorel={anchorEl} onClose={onClose}>
      <Box sx={{ p: 3, px: 5 }}>{content}</Box>
    </Dialog>
  ) : (
    <Box component={Paper} sx={{ p: 3, px: 5 }}>
      {content}
    </Box>
  );
}

export default Bridges;
