import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  Grid,
  Card,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

export default function TryExample() {
  const { t } = useTranslation();
  const [alert, setAlert] = useState({ message: "", severity: "", open: false });
  const [loading, setLoading] = useState(false);

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    const formattedPhoneNumber = phoneNumber.replace(/\s+/g, "");
    
    if (formattedPhoneNumber && message) {
      setLoading(true);
      try {
        await window.api.sendSMS({ text: message, number: formattedPhoneNumber });
        console.log("SMS sent successfully");
        setAlert({
          message: "SMS sent successfully",
          severity: "success",
          open: true,
        });
        setPhoneNumber("");
        setMessage("");
      } catch (error) {
        console.error("Error sending SMS:", error);
        setAlert({
          message: error.message,
          severity: "error",
          open: true,
        });
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Please enter both phone number and message.");
    }
  };

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <Box sx={{ p: 10 }}>
        <Grid container columnSpacing={4} my="auto">
          
          <Grid item sm={5}>
            <Typography variant="h6">Try Example</Typography>
            <Typography variant="body2" sx={{ mt: 5 }}>
              Enter a phone number and a message below, then click Send to test
              the SMS functionality.
            </Typography>
          </Grid>

          <Grid item sm={7}>
            <Card align="center" mx="auto" sx={{ width: "600px", p: 5 }}>
              <MuiTelInput
                value={phoneNumber}
                onChange={(newValue) => setPhoneNumber(newValue)}
                fullWidth
                variant="standard"
                placeholder={t("enterPhoneNumber")}
                defaultCountry="CM"
                sx={{ mb: 2 }}
              />
              <Input
                label="Message"
                multiline
                rows={3}
                value={message}
                placeholder={t("message")}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleSend}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? "Sending..." : "Send"}
              </Button>
            </Card>
          </Grid>
          <Grid container>
            <Grid item md={4} sx={{ position: "fixed", bottom: 50, mr: 10 }}>
              <Button
                component={Link}
                to="/onboarding3"
                variant="contained"
                sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
              >
                <FaChevronLeft /> {t("previous")}{" "}
              </Button>
            </Grid>
            <Grid item md={4} sx={{ position: "fixed", bottom: 50, ml: 65 }}>
              <Button
                component={Link}
                to="/messages"
                variant="underlined"
                sx={{ px: 2, textTransform: "none" }}
              >
                {t("skip")}
              </Button>
            </Grid>
            <Grid
              item
              md={4}
              justifyContent="flex-end"
              sx={{
                right: 0,
                display: "flex",
                position: "fixed",
                bottom: 50,
                mr: 10,
              }}
            >
              <Button
                component={Link}
                to="/onboarding4"
                variant="contained"
                sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
              >
                {t("next")} <FaChevronRight />{" "}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
