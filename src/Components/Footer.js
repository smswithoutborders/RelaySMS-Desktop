import { Box, Fab, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { FaPen, FaUsers } from "react-icons/fa";
import Compose from "../Pages/Compose";
import AddAccounts from "../Components/AddAccounts"; 
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [composeDrawerOpen, setComposeDrawerOpen] = useState(false);
  const [addAccountsDrawerOpen, setAddAccountsDrawerOpen] = useState(false); // State for AddAccounts drawer

  const handlePenClick = () => {
    setComposeDrawerOpen(true);
  };

  const handleComposeDrawerClose = () => {
    setComposeDrawerOpen(false);
  };

  const handleAddAccountsClick = () => {
    setAddAccountsDrawerOpen(true);
  };

  const handleAddAccountsDrawerClose = () => {
    setAddAccountsDrawerOpen(false);
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
        <Fab variant="extended" sx={{ textTransform: "none" }} onClick={handleAddAccountsClick}>
          <FaUsers size="20px" style={{ marginRight: 3 }} /> {t("addAccounts")}
        </Fab>
      </Box>
      <Compose open={composeDrawerOpen} onClose={handleComposeDrawerClose} />
      <AddAccounts open={addAccountsDrawerOpen} onClose={handleAddAccountsDrawerClose} />
    </Box>
  );
}
