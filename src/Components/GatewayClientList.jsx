import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Switch,
  Skeleton,
  Box,
  Typography,
} from "@mui/material";

function GatewayClientList({ items, onSelect, loading }) {
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const defaultItem = items.find((item) => item.default);
    if (defaultItem && selectedItems.length === 0) {
      setSelectedItems([defaultItem.msisdn]);
      onSelect({ ...defaultItem, active: true });
    }
  }, [items, selectedItems, onSelect]);

  const handleToggle = (itemKey) => {
    const updatedSelectedItems = selectedItems.includes(itemKey)
      ? []
      : [itemKey];
    setSelectedItems(updatedSelectedItems);
    const selectedItem = items.find((item) => item.msisdn === itemKey);
    onSelect({
      ...selectedItem,
      active: updatedSelectedItems.includes(itemKey),
    });
  };

  return (
    <List>
      {loading ? (
        Array.from(new Array(5)).map((_, index) => (
          <ListItem key={index} sx={{ display: "flex", alignItems: "center" }}>
            <Skeleton
              variant="text"
              width={120}
              height={30}
              sx={{ marginRight: 2 }}
            />
            <Skeleton
              variant="text"
              width={80}
              height={30}
              sx={{ marginRight: 2 }}
            />
            <Skeleton
              variant="text"
              width={100}
              height={30}
              sx={{ marginRight: 2 }}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Skeleton variant="circular" width={24} height={24} />
            </Box>
          </ListItem>
        ))
      ) : items.length === 0 ? (
        <Typography
          sx={{ padding: 2, textAlign: "center", color: "text.secondary" }}
        >
          No gateway client
        </Typography>
      ) : (
        items.map((item) => (
          <ListItem key={item.msisdn}>
            <ListItemText
              primary={item.msisdn}
              secondary={
                <React.Fragment>
                  <span>{item.operator_code}</span>
                  <br />
                  <span>{item.operator}</span>
                  <br />
                  <span>{item.country}</span>
                </React.Fragment>
              }
              primaryTypographyProps={{
                sx: { fontWeight: "bold", color: "text.primary" },
              }}
            />
            <Switch
              checked={selectedItems.includes(item.msisdn) || item.active}
              onChange={() => handleToggle(item.msisdn)}
              name={item.msisdn}
              color="primary"
            />
          </ListItem>
        ))
      )}
    </List>
  );
}

export default GatewayClientList;
