import React, { useState } from "react";
import { List, ListItemText, ListItemButton } from "@mui/material";

const ItemsList = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index, action) => {
    setActiveIndex(index); // Update the active item
    if (action) action(); // Execute the item's action
  };

  return (
    <List>
      {items.map((item, index) => (
        <ListItemButton
          key={index}
          onClick={() => handleClick(index, item.action)}
          sx={{
            cursor: "pointer",
            backgroundColor: activeIndex === index ? "background.default" : "transparent",
            "&:hover": {
              backgroundColor: "",
            },
          }}
        >
          <ListItemText primary={item.name} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default ItemsList;
