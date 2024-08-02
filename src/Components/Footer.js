import { Box, Button, } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPen } from "react-icons/fa6";
import Compose from "../Pages/Compose";

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
          <Button variant="contained" onClick={handlePenClick} sx={{borderRadius: 2, textTransform: "none"}}>
            {t("compose")}<FaPen size="16px" style={{marginLeft: 7}}/>
          </Button>
     </Box>
     <Compose open={drawerOpen} onClose={handleCloseDrawer} />{" "}
    </Box>
  );
}
