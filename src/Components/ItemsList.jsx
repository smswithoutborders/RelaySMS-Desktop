import React from "react";
import { List, ListItemText, ListItemButton } from "@mui/material";

const ItemsList = ({ items }) => (
  <List>
    {items.map((item, index) => (
      <ListItemButton
        key={index}
        onClick={item.action}
        sx={{ cursor: "pointer" }}
      >
        <ListItemText primary={item.name} />
      </ListItemButton>
    ))}
  </List>
);

export default ItemsList;
