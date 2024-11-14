import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";

function GatewayClientList({ items, onSelect }) {
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    // Set the default selected item if no item is selected yet
    const defaultItem = items.find((item) => item.default);
    if (defaultItem && selectedItems.length === 0) {
      setSelectedItems([defaultItem.key]);
      onSelect({ ...defaultItem, active: true }); // Notify with the default item as active
    }
  }, [items, selectedItems, onSelect]);

  const handleToggle = (itemKey) => {
    // Make only one item active at a time
    const updatedSelectedItems = selectedItems.includes(itemKey)
      ? [] // Deactivate item if it's already selected
      : [itemKey]; // Activate new item and deactivate others

    setSelectedItems(updatedSelectedItems);

    // Find the selected item from the items array
    const selectedItem = items.find((item) => item.key === itemKey);

    // Return the updated item with the active flag
    onSelect({
      ...selectedItem,
      active: updatedSelectedItems.includes(itemKey), // Set active flag for selected item
    });
  };

  return (
    <List>
      {items.map((item) => (
        <ListItem key={item.key}>
          <ListItemText
            primary={item.key}
            secondary={
              <React.Fragment>
                <span>{item.name}</span>
                <br />
                <span>{item.country}</span>
              </React.Fragment>
            }
            primaryTypographyProps={{
              sx: { fontWeight: 'bold', color: 'text.primary' },
            }}
          />
          <Switch
            checked={selectedItems.includes(item.key) || item.active}
            onChange={() => handleToggle(item.key)}
            name={item.key}
            color="primary"
          />
        </ListItem>
      ))}
    </List>
  );
}

export default GatewayClientList;
