import { useTranslation } from "react-i18next";
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";


export default function RevokeDialog({ tokens, handleTokenRevoke }) {
    const { t } = useTranslation();
  
    return (
      <Box sx={{ py: 4, px: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {t("savedAccounts")}
        </Typography>
        <List>
          {tokens.map((token, index) => (
            <List key={index}>
              <ListItem
                sx={{ display: "flex", alignItems: "center" }}
                onClick={() => handleTokenRevoke(token.platform, token.account_identifier)}
              >
                <ListItemAvatar>
                  <Box
                    component="img"
                    src={
                      token.platform === "gmail" ? "gmail.svg" : "x-twitter.svg"
                    }
                    sx={{ width: "40px", height: "40px", marginRight: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="body2">{token.account_identifier}</Typography>
                </ListItemText>
              </ListItem>
            </List>
          ))}
        </List>
      </Box>
    );
  }
  