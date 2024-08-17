import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaArrowsRotate, FaPlus } from "react-icons/fa6";

export default function AdvancedSettings({ open, onClose }) {
  const { t } = useTranslation();
  const [gatewayClients, setGatewayClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedMSISDN, setSelectedMSISDN] = useState(null);

  const fetchClients = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const clients = await window.api.fetchGatewayClients();
      setGatewayClients(clients);
      const storedMSISDN = await window.api.retrieveParams("selectedMSISDN");
      setSelectedMSISDN(storedMSISDN);
    } catch (error) {
      console.error("Error fetching gateway clients:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open]);

  const handleToggle = (index) => {
    setGatewayClients((prevClients) => {
      const newClients = [...prevClients];
      newClients[index].active = !newClients[index].active;
      return newClients;
    });
  };

  const handleSelectMSISDN = (msisdn) => {
    setSelectedMSISDN(msisdn);
    window.api.storeParams("selectedMSISDN", msisdn);
  };

  return (
    <Box open={open} onClose={onClose}>
      <Box open={fetchClients} sx={{ px: 1, py: 2 }}>
        <Box justifyContent="space-between" sx={{ display: "flex" }}>
          <Button
            size="small"
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "whitesmoke",
              color: "black",
            }}
          >
            <FaPlus /> Add
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "whitesmoke",
              color: "black",
            }}
            onClick={fetchClients}
          >
            Refresh
            <FaArrowsRotate />
          </Button>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, pt: 2 }}>
          {t("gatewayClients")}
        </Typography>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress />
          </Box>
        ) : hasError ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "red" }}>
              Something went wrong, please refresh.
            </Typography>
            <Button
              size="small"
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "whitesmoke",
                color: "black",
                mt: 1,
              }}
              onClick={fetchClients}
            >
              Refresh
              <FaArrowsRotate />
            </Button>
          </Box>
        ) : (
          <List sx={{ px: 1 }}>
            {gatewayClients.map((client, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSelectMSISDN(client.msisdn)}
                selected={selectedMSISDN === client.msisdn}
                secondaryAction={
                  <Switch
                    edge="end"
                    checked={
                      selectedMSISDN === client.msisdn || client.active || false
                    }
                    onChange={() => handleToggle(index)}
                  />
                }
              >
                <ListItemText>
                  <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                    {client.country}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {client.operator}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                    {client.msisdn}
                  </Typography>
                </ListItemText>
                <Divider />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
