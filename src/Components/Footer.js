import { Box, Fab, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { FaPen, FaUsers } from "react-icons/fa";
import Compose from "../Pages/Compose";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handlePenClick = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        right: 0,
        margin: "28px",
        justifyContent: "flex-end",
      }}
    >
      <Box>
        <Tooltip title="Compose">
          <Fab variant="contained" onClick={handlePenClick}>
            <FaPen size="18px" />
          </Fab>
        </Tooltip>
      </Box>
      <br />
      <Box>
        <Fab variant="extended" sx={{ textTransform: "none" }}>
          <FaUsers size="20px" style={{ marginRight: 3 }} /> {t("addAccounts")}
        </Fab>
      </Box>
      <Compose open={drawerOpen} onClose={handleCloseDrawer} />{" "}
    </Box>
  );
}
