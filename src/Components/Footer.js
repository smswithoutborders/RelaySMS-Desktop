import { Box, Button, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { FaPen, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import Compose from "../Pages/Compose";

export default function Footer() {
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
          <Button
            variant="contained"
            sx={{ borderRadius: 5, py: 1.5 }}
            onClick={handlePenClick}
          >
            <FaPen size="16px" />
          </Button>
        </Tooltip>
      </Box>
      <br />
      <Box>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{ borderRadius: 5, px: 2 }}
        >
          <FaUsers size="20px" style={{ marginRight: 5 }} /> Add Accounts
        </Button>
      </Box>
      <Compose open={drawerOpen} onClose={handleCloseDrawer} />{" "}
    </Box>
  );
}
