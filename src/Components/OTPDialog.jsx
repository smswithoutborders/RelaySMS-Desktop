import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid2 as Grid,
  Alert as MuiAlert,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function OTPDialog({
  open,
  onClose,
  onSubmit,
  onResend,
  counterTimestamp,
  placeholder,
  type = "number",
  otpLength = 6,
  subText,
  rows,
  fullWidth,
  event,
}) {
  const [otp, setOtp] = useState(
    type === "number" ? Array(otpLength).fill("") : ""
  );
  const [counter, setCounter] = useState(0);
  const [alert, setAlert] = useState({
    message: "",
    severity: "info",
    onClose: null,
  });
  const [loading, setLoading] = useState(false);
  const [callbackIntervalCounter, setCallbackIntervalCounter] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      const now = Math.floor(Date.now() / 1000);
      const remainingTime = counterTimestamp - now;
      setCounter(remainingTime > 0 ? remainingTime : 0);
    }
  }, [open, counterTimestamp]);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const handleOtpChange = (event, index) => {
    const value = event.target.value;
    if (/^[0-9]?$/.test(value) && type === "number") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otpLength - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    } else if (type === "text") {
      setOtp(value);
    }
    setAlert({ ...alert, message: "" });
  };

  const handleKeyDown = (event, index) => {
    if (type === "number" && event.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  };

  const handleOtpSubmit = async () => {
    const otpValue = type === "number" ? otp.join("") : otp;
    if (otpValue.length >= otpLength) {
      setLoading(true);
      try {
        await onSubmit(setAlert, otpValue);
      } finally {
        setLoading(false);
        setOtp(type === "number" ? Array(otpLength).fill("") : "");
      }
    } else {
      setAlert({
        message: "Please enter a valid OTP.",
        severity: "error",
        onClose: null,
      });
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await onResend();
    } finally {
      setLoading(false);
      setOtp(type === "number" ? Array(otpLength).fill("") : "");
    }
  };

  useEffect(() => {
    if (open && event?.callback) {
      const fetchOtp = async () => {
        try {
          const fetchedOtp = await event.callback();

          if (fetchedOtp) {
            setOtp(() => {
              const paddedOtp =
                type === "number"
                  ? fetchedOtp
                      .split("")
                      .concat(Array(otpLength - fetchedOtp.length).fill(""))
                  : fetchedOtp;
              return paddedOtp;
            });
          }
        } catch (error) {
          console.error("Error fetching OTP:", error);
        }
      };

      if (open) {
        fetchOtp();

        if (event.interval) {
          setCallbackIntervalCounter(event.interval / 1000);

          const callbackTimer = setInterval(() => {
            setCallbackIntervalCounter((prev) => {
              if (prev <= 1) {
                fetchOtp();
                return event.interval / 1000;
              }
              return prev - 1;
            });
          }, 1000);

          return () => {
            clearInterval(callbackTimer);
          };
        }
      }
    }
  }, [open, event]);

  useEffect(() => {
    if (open && type === "number") {
      document.getElementById("otp-0")?.focus();
    }
  }, [open, type]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="otp-dialog-title"
      sx={{ "& .MuiDialog-paper": { width: 500 } }}
    >
      <DialogContent sx={{ px: 5, pt: 5 }}>
        <Typography
          id="otp-dialog-title"
          variant="h6"
          gutterBottom
          textAlign="center"
        >
         {t("common.verify identity")}
        </Typography>

        <Typography
          id="otp-dialog-title"
          variant="body2"
          gutterBottom
          textAlign="center"
          mt={2}
        >
          {subText}
        </Typography>

        {alert?.message && (
          <Box mt={2}>
            <MuiAlert
              severity={alert.severity || "info"}
              onClose={alert.onClose || undefined}
            >
              {alert.message}
            </MuiAlert>
          </Box>
        )}

        {event?.interval && callbackIntervalCounter > 0 && (
          <Box mt={2}>
            <MuiAlert
              severity="info"
              variant="outlined"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="body2" component="span">
                  {t("common.retrieving otp")}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  {t("common.check again")}{" "}
                  <strong>{callbackIntervalCounter} {t("common.seconds")}</strong>. {t("common.double check")}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => (window.location.hash = "/deku")}
                >
                  {t("common.check deku")}
                </Button>
              </Box>
            </MuiAlert>
          </Box>
        )}

        <Box mt={2}>
          {type === "number" ? (
            <Grid container spacing={1}>
              {otp.map((digit, index) => (
                <Grid size={12 / otpLength} key={index}>
                  <TextField
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    slotProps={{
                      input: {
                        maxLength: 1,
                        style: { textAlign: "center" },
                        "aria-label": `OTP digit ${index + 1}`,
                      },
                    }}
                    variant="outlined"
                    autoComplete="off"
                    disabled={loading}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TextField
              fullWidth={fullWidth}
              value={otp}
              onChange={(e) => handleOtpChange(e)}
              placeholder={placeholder}
              variant="outlined"
              autoComplete="off"
              disabled={loading}
              rows={rows || 4}
              multiline={true}
            />
          )}
        </Box>

        {counterTimestamp > 0 && (
          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {t("common.didnt recieve otp")}
            </Typography>
            {counter > 0 ? (
              <Box mt={2}>
                <MuiAlert severity="info" variant="outlined">
                {t("common.resend otp")} {t("in")} {counter} {t("common.seconds")}
                </MuiAlert>
              </Box>
            ) : (
              <Button
                size="small"
                onClick={handleResend}
                color="primary"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : null
                }
              >
                {loading ? t("common.resending otp") : t("common.resend otp")}
              </Button>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 5, pb: 5 }}>
        <Button
          onClick={onClose}
          color="error"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mr: 1 }}
        >
          {t("ui.cancel")}
        </Button>
        <Button
          onClick={handleOtpSubmit}
          color="primary"
          variant="contained"
          fullWidth
          disabled={
            (type === "number"
              ? otp.join("").length < otpLength
              : otp.length < otpLength) || loading
          }
          startIcon={
            loading ? <CircularProgress size={24} color="inherit" /> : null
          }
        >
          {loading ? t("ui.submitting") : t("ui.submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OTPDialog;
