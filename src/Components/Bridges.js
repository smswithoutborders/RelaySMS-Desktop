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
  Grid,
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
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [authPhrase, setAuthPhrase] = useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    setOtpOpen(false);
    setOtp(Array(6).fill(""));
    setAuthPhrase("");
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
        data: clientPublishKeyPair.publicKey,
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
      const messages = await window.api.fetchMessages();

      if (!Array.isArray(messages)) {
        console.error("Expected messages to be an array, but got:", messages);
        return;
      }

      const otpMessage = messages.find((msg) =>
        msg.text.includes("Your RelaySMS code is")
      );

      if (otpMessage) {
        const otpCode = otpMessage.text.match(/\d+/)[0];
        setOtp(otpCode.split(""));
        
        const authPhraseMatch = otpMessage.text.match(
          /Paste this in the app:\s*(.*)/
        );
        const authPhrase = authPhraseMatch ? authPhraseMatch[1] : null;

        if (authPhrase) {
          await window.api.storeParams("authPhrase", authPhrase); 
          console.log("Auth phrase saved:", authPhrase);
          setAuthPhrase(authPhrase);
          setAlert({
            message: `OTP received: ${otpCode}, Auth Phrase: ${authPhrase}`,
            severity: "info",
            open: true,
          });
        } else {
          console.log("No auth phrase found in message.");
        }
      } else {
        console.log("No OTP message found in received messages.");
      }
    } catch (error) {
      console.error("Failed to retrieve messages:", error);
    }
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    const enteredOtp = otp.join("");

    try {
      const clientPublishKeyPair = await window.api.fetchMessages(
        "client_publish_key_pair"
      );
      const payload = await window.api.bridgePayload({
        contentSwitch: 1,
        data: enteredOtp,
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

      <Dialog open={otpOpen} onClose={handleClose}>
        <Box sx={{ p: 3, py: 3 }}>
          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 2, fontWeight: 60 }}
          >
            {t("enterOTP")}
          </Typography>
          <Box mt={2} mb={2}>
            <Grid container spacing={1}>
              {otp.map((digit, index) => (
                <Grid item xs={2} key={index}>
                  <TextField
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center" },
                    }}
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="body1"
                align="center"
                sx={{ mb: 2, fontWeight: 60 }}
              >
                {t("inputAuthPhrase")}
              </Typography>
              <TextField
              fullWidth
                value={authPhrase}
                onChange={(e) => setAuthPhrase(e.target.value)}
              ></TextField>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            onClick={handleOtpSubmit}
          >
            {loading ? "Verifying..." : t("submit")}
          </Button>
          <Button
            variant="text"
            color="secondary"
            fullWidth
            onClick={handleClose}
            sx={{ mt: 1 }}
          >
            Cancel
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
