import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import {
  FaArrowLeft,
  FaGlobe,
  FaShieldHalved,
  FaTowerCell,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <Box sx={{ m: 4, mt: 6 }}>
      <Box sx={{ display: "flex", my: 2, ml: 2 }}>
        <IconButton sx={{ mr: 2 }} component={Link} to="/messages">
          <FaArrowLeft size="20px" />
        </IconButton>
        <Typography variant="h6">Settings</Typography>
      </Box>
      {/*  */}
      <Box>
        <List>
          <Typography sx={{ pt: 3, ml: 9 }} variant="body2">
            Accessibility
          </Typography>
          <ListItem>
            <ListItemIcon>
              <FaGlobe />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Language
              </Typography>
              <Typography variant="body2">English</Typography>
            </ListItemText>
            <Divider />
          </ListItem>
          <Typography sx={{ pt: 4, ml: 9 }} variant="body2">
            Security and Privacy
          </Typography>
          <ListItem>
            <ListItemIcon>
              <FaShieldHalved />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Security
              </Typography>
              <Typography variant="body2">
                Enable app locks and pin codes
              </Typography>
            </ListItemText>
            <Divider />
          </ListItem>
          <Typography sx={{ pt: 4, ml: 9 }} variant="body2">
            Advanced Settings
          </Typography>
          <ListItem>
            <ListItemIcon>
              <FaTowerCell />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Gateway Clients
              </Typography>
              <Typography variant="body2">
                Add/Remove Gateway clients for SMS routing
              </Typography>
            </ListItemText>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
