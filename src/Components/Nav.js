import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        margin: "30px",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Tooltip title="Settings">
        <IconButton component={Link} to="/settings">
          <FaEllipsisVertical />
        </IconButton>
      </Tooltip>
    </nav>
  );
}
