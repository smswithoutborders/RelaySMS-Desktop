import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FaArrowsRotate, FaPlus } from 'react-icons/fa6';

export default function AdvancedSettings({ open, onClose }) {
  const { t } = useTranslation();
  const [gatewayClients, setGatewayClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await window.api.fetchGatewayClients();
        setGatewayClients(clients);
      } catch (error) {
        console.error('Error fetching gateway clients:', error);
      }
    };

    fetchClients();
  }, [open]);

  const handleToggle = (index) => {
    setGatewayClients(prevClients => {
      const newClients = [...prevClients];
      newClients[index].active = !newClients[index].active;
      return newClients;
    });
  };

  return (
    <Box open={open} onClose={onClose} sx={{ py: 2, px: 2 }}>
      <Box sx={{ px: 1, py: 1 }}>
        <Box justifyContent="space-between" sx={{display:'flex'}}>
          <Button size='small' variant='contained' sx={{textTransform: "none", backgroundColor: "whitesmoke", color: "black"}}>
            <FaPlus/> Add
          </Button>
          <Button size='small' variant='contained' sx={{textTransform: "none", backgroundColor: "whitesmoke", color: "black"}}>
            Refresh<FaArrowsRotate/>
          </Button>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, pt: 2 }}>
          {t('gatewayClients')}
        </Typography>
        <List sx={{ px: 1 }}>
          {gatewayClients.map((client, index) => (
            <ListItem key={index} secondaryAction={
              <Switch
                edge="end"
                checked={client.active || false}
                onChange={() => handleToggle(index)}
              />
            }>
              <ListItemText>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  {client.country}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {client.operator}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  {client.msisdn}
                </Typography>
              </ListItemText>
              <Divider />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
