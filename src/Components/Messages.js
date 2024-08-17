import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const MessageDetail = ({ message }) => {
  const { t } = useTranslation();

  if (!message) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
        my="auto"
      >
        <Typography variant="h5">{t("noRecentMessages")}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="body1">{message.subject || t("noSubject")}</Typography>
      <Typography variant="body2">{message.message}</Typography>
      <Typography variant="caption">{message.timestamp}</Typography>
    </Box>
  );
};

export default MessageDetail;