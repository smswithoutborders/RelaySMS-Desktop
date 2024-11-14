import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

const ItemsList = ({ items }) => (
  <List>
    {items.map((item, index) => (
      <ListItem button key={index} onClick={item.action}>
        <ListItemText primary={item.name} />
      </ListItem>
    ))}
  </List>
);

export default ItemsList;
