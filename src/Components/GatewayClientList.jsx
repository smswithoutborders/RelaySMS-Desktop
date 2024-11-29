import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Switch,
  Skeleton,
  Box,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function GatewayClientList({ items, onSelect, loading }) {
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  useEffect(() => {
    const activeItem = localItems.find((item) => item.active);
    const defaultItem = localItems.find((item) => item.default);

    if (!activeItem && defaultItem) {
      const updatedItems = localItems.map((item) =>
        item.msisdn === defaultItem.msisdn
          ? { ...item, active: true }
          : { ...item, active: false }
      );
      setLocalItems(updatedItems);
      onSelect({ ...defaultItem, active: true });
    }
  }, [localItems, onSelect]);

  const handleToggle = (itemKey) => {
    setLocalItems((prevItems) =>
      prevItems.map((item) =>
        item.msisdn === itemKey
          ? { ...item, active: true }
          : { ...item, active: false }
      )
    );

    const selectedItem = items.find((item) => item.msisdn === itemKey);

    onSelect({ ...selectedItem, active: true });
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
      ) : localItems.length === 0 ? (
        <Typography
          sx={{ padding: 2, textAlign: "center", color: "text.secondary" }}
        >
          No gateway client
        </Typography>
      ) : (
        localItems.map((item) => (
          <ListItem
            key={item.msisdn}
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{ fontWeight: "bold", color: "text.primary" }}
                  >
                    {item.msisdn}
                  </Typography>
                </Box>
              }
              secondary={
                <React.Fragment>
                  <span>{item.operator_code}</span>
                  <br />
                  <span>{item.operator}</span>
                  <br />
                  <span>{item.country}</span>
                </React.Fragment>
              }
            />
            {item.verified && (
              <Tooltip
                title="This number is trusted by SMSwithoutborders"
                arrow
              >
                <Chip
                  label="Verified"
                  color="success"
                  variant="outlined"
                  icon={<CheckCircleIcon />}
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    fontSize: "0.75rem",
                    padding: "2px 6px",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            )}
            <Switch
              checked={item.active || false}
              onChange={() => handleToggle(item.msisdn)}
              name={item.msisdn}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "green",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "green",
                },
              }}
            />
          </ListItem>
        ))
      )}
    </List>
  );
}

export default GatewayClientList;
