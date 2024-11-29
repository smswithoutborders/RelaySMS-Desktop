import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { List, ListItemText, ListItemButton } from "@mui/material";

const ItemsList = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { t, i18n } = useTranslation();

  const handleClick = (item, index, action) => {
    setActiveIndex(index);
    if (action) action(item);
  };

  return (
    <List>
      {items.map((item, index) => (
        <ListItemButton
          key={index}
          onClick={() => handleClick(item, index, item.action)}
          sx={{
            cursor: "pointer",
            backgroundColor:
              activeIndex === index ? "background.default" : "transparent",
            "&:hover": {
              backgroundColor: "",
            },
          }}
        >
          <ListItemText primary={t(`ui.${item.name.toLowerCase()}`)} />
          {item.icon && <span style={{ marginLeft: "8px" }}>{item.icon}</span>}
        </ListItemButton>
      ))}
    </List>
  );
};

export default ItemsList;
