import { Typography, Box, IconButton, Tab, Tabs } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Onboarding3() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(null);
  const [selectedDistro, setSelectedDistro] = useState(0); 
  const handleTabChange = (event, newValue) => {
    setSelectedDistro(newValue);
    setCopied(null); 
  };

  const ubuntuCommandsStep1 = [
    "sudo apt install build-essential libpython3-dev libdbus-1-dev",
    "sudo apt install python3-gi python3-gi-cairo gir1.2-gtk-3.0",
    "sudo apt install libgirepository1.0-dev gcc libcairo2-dev pkg-config python3-dev python3-venv",
  ];

  const archCommandsStep1 = [
    "sudo pacman -S python-gobject gtk3",
    "sudo pacman -S python cairo pkgconf gobject-introspection gtk3",
  ];

  const commandsStep2 = [
    "git clone git@github.com:smswithoutborders/SMSWithoutBorders-Gateway-Client.git",
    "cd SMSWithoutBorders-Gateway-Client",
    "make",
    "make start",
  ];

  return (
    <Box sx={{ px: 5, py: 7 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        {t("settingUpGatewayClients")}
      </Typography>

      <Tabs value={selectedDistro} onChange={handleTabChange} centered>
        <Tab label="Ubuntu" />
        <Tab label="Arch" />
      </Tabs>
      {/* Step 1 */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 3 }}>
        {t("step1")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t("installDependencies")}
      </Typography>

      {(selectedDistro === 0 ? ubuntuCommandsStep1 : archCommandsStep1).map(
        (command, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "background.custom",
              p: 2,
              borderRadius: 2,
              mb: 1,
            }}
          >
            <pre style={{ margin: 0, flex: 1, overflow: "none", fontSize: "12px" }}>{command}</pre>
            <CopyToClipboard text={command} onCopy={() => setCopied(index)}>
              <IconButton aria-label="copy" color="primary">
                <ContentCopy />
              </IconButton>
            </CopyToClipboard>
            {copied === index && (
              <Typography variant="caption" color="success" sx={{ ml: 2 }}>
                {t("copied")}
              </Typography>
            )}
          </Box>
        )
      )}

      {/* Step 2 */}
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
        {t("step2")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t("cloneRepoAndStart")}
      </Typography>

      {commandsStep2.map((command, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "background.custom",
            p: 2,
            borderRadius: 2,
            mb: 1,
          }}
        >
          <pre style={{ margin: 0, flex: 1,overflow: "none", fontSize: "12px" }}>{command}</pre>
          <CopyToClipboard
            text={command}
            onCopy={() =>
              setCopied(
                index +
                  (selectedDistro === 0
                    ? ubuntuCommandsStep1.length
                    : archCommandsStep1.length)
              )
            }
          >
            <IconButton aria-label="copy" color="primary">
              <ContentCopy />
            </IconButton>
          </CopyToClipboard>
          {copied ===
            index +
              (selectedDistro === 0
                ? ubuntuCommandsStep1.length
                : archCommandsStep1.length) && (
            <Typography variant="caption" color="success" sx={{ ml: 2 }}>
              {t("copied")}
            </Typography>
          )}
        </Box>
      ))}
      {/* Step 3 */}
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
        {t("step3")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t("plugModem")}
      </Typography>

      {/* Step 4 */}
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
        {t("step4")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t("publish")}
      </Typography>
    </Box>
  );
}
