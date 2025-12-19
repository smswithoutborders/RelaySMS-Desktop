import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTranslation } from "react-i18next";

const CAPTCHA_SERVER_URL = process.env.REACT_APP_CAPTCHA_URL || "http://captcha.smswithoutborders.com";

function CaptchaDialog({ open, onClose, onVerified }) {
  const { t } = useTranslation();
  const [captchaImage, setCaptchaImage] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const fetchCaptcha = async () => {
    setLoading(true);
    setError("");
    setUserAnswer("");
    
    try {
      const response = await fetch(`${CAPTCHA_SERVER_URL}/v1/captcha/generate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch CAPTCHA");
      }

      const data = await response.json();
      setCaptchaImage(data.image);
      setCaptchaToken(data.token);
    } catch (err) {
      setError(t("ui.failed to load captcha. please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCaptcha();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleVerify = async () => {
    if (!userAnswer.trim()) {
      setError(t("ui.please enter the captcha text"));
      return;
    }

    setVerifying(true);
    setError("");

    try {
      const response = await fetch(`${CAPTCHA_SERVER_URL}/v1/captcha/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: captchaToken,
          text: userAnswer,
        }),
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        onVerified(captchaToken);
        onClose();
      } else {
        setError(t("ui.incorrect captcha. please try again."));
        fetchCaptcha();
      }
    } catch (err) {
      setError(t("ui.verification failed. please try again."));
      fetchCaptcha();
    } finally {
      setVerifying(false);
    }
  };

  const handleClose = () => {
    setUserAnswer("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("ui.security verification")}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          {t("ui.please enter the text shown in the image below")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            minHeight: 100,
            position: "relative",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : captchaImage ? (
            <Box sx={{ position: "relative" }}>
              <img
                src={`data:image/png;base64,${captchaImage}`}
                alt="CAPTCHA"
                style={{
                  maxWidth: "100%",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                }}
              />
              <IconButton
                onClick={fetchCaptcha}
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  "&:hover": {
                    bgcolor: "background.paper",
                  },
                }}
                size="small"
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : null}
        </Box>

        <TextField
          fullWidth
          label={t("ui.enter captcha text")}
          variant="standard"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={loading || verifying}
          error={Boolean(error)}
          helperText={error}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleVerify();
            }
          }}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={verifying}>
          {t("ui.cancel")}
        </Button>
        <Button
          onClick={handleVerify}
          variant="contained"
          disabled={loading || verifying || !userAnswer.trim()}
          sx={{
            bgcolor: "background.more",
            color: "background.other",
            "&:hover": {
              bgcolor: "background.other",
              color: "background.more",
            },
          }}
        >
          {verifying ? <CircularProgress size={24} /> : t("ui.verify")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CaptchaDialog;
