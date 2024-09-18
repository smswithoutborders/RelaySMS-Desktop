import React, { useState } from "react";
import { Box, Typography, Collapse, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import Onboarding3 from "./Onboarding3";

export default function Tutorial() {
  const { t } = useTranslation();
  const [showStep3Content, setShowStep3Content] = useState(false);

  const handleToggleStep3 = () => {
    setShowStep3Content((prev) => !prev);
  };

  return (
    <Box sx={{ m: 5 }}>
      <Button sx={{textTransform: "none"}} component={Link} to="/help">
        <FaChevronLeft /> 
        <Typography variant="body2">
        {t("help")}
        </Typography>
      </Button>

<Box sx={{mx: 5}}>
      <Box sx={{ py: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          {t("step1")}
        </Typography>
        <Typography variant="body2">Login or sign up</Typography>
      </Box>

      <Box sx={{ py: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          {t("step2")}
        </Typography>
        <Typography variant="body2">
          <b>Store tokens</b> - Storing platform (Gmail, X(Twitter), Telegram)
          tokens simply means giving RelaySMS access to send messages on your
          behalf.
        </Typography>
      </Box>

      <Box sx={{ py: 2 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            mb: 1,
          }}
        >
          {t("step3")}
        </Typography>
        <Typography variant="body2">
          <b>Select Gateway Client(MSISDN)</b> - This is just a number that
          helps route your offline messages to online platforms.{" "}
        </Typography>
        <Typography
          variant="body2"
          sx={{ py: 1, fontWeight: 600, color: "#347FC4", cursor: "pointer" }}
          onClick={handleToggleStep3}
        >
          <b>See how</b>
          {showStep3Content ? <FaChevronUp /> : <FaChevronDown />}
        </Typography>
        <Collapse in={showStep3Content}>
          <Box sx={{ mt: 2 }}>
            <Onboarding3 />
          </Box>
        </Collapse>
      </Box>

      <Box sx={{ py: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          {t("step4")}
        </Typography>
        <Typography variant="body2">
          <b>Compose</b> - Click the compose Icon, select platform to see saved tokens, pick one, compose message and send.
        </Typography>
      </Box>

      <Box sx={{ py: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          {t("done")}
        </Typography>
      </Box>
      </Box>
    </Box>
  );
}
