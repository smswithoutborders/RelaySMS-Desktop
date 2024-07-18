import { Box, Fab } from "@mui/material";
import React, { useState } from "react";
import { FaUsers } from "react-icons/fa";
import AddAccounts from "../Components/AddAccounts"; 
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [addAccountsDrawerOpen, setAddAccountsDrawerOpen] = useState(false); 

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
        left: 80,
        margin: "28px",
        justifyContent: "flex-end",
      }}
    >
      <Box>
        <Fab variant="extended" sx={{ textTransform: "none" }} onClick={handleAddAccountsClick}>
          <FaUsers size="20px" style={{ marginRight: 3 }} /> {t("addAccounts")}
        </Fab>
      </Box>
      <AddAccounts open={addAccountsDrawerOpen} onClose={handleAddAccountsDrawerClose} />
    </Box>
  );
}
