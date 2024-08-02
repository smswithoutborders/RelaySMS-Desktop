import { Typography, Box, Grid, Button } from "@mui/material";
import React, {useState} from "react";
import { FaChevronLeft, FaChevronRight, FaUsers } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddAccounts from "../Components/AddAccounts";

export default function Onboarding3() {
  const { t } = useTranslation();
  const [addAccountsDialogOpen, setAddAccountsDialogOpen] = useState(false); 


  const handleAddAccountsClick = () => {
    setAddAccountsDialogOpen(true);
  };

  const handleAddAccountsDialogClose = () => {
    setAddAccountsDialogOpen(false);
  };

  return (
    <Box my="auto" sx={{ px: 5, py: 10 }}>
      <Grid container>
        <Grid item md={6} sm={6} sx={{ py: 10 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t("addAccounts")}
          </Typography>
          <Typography variant="h6" sx={{ opacity: "70%", pt: 10 }}>
            {" "}
            {t("vaultsOnboarding2")}{" "}
          </Typography>

          <Box sx={{ pt: 10 }}>
            <Button  onClick={handleAddAccountsClick} 
              variant="contained"
              sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
            >
              {" "}
              <FaUsers />
              {t("addAccounts")}
            </Button>
          </Box>
        </Grid>
        <Grid item md={6} sm={6}>
          <Box component="img" src="vault.png" sx={{ width: "80%" }} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={4} sx={{ position: "fixed", bottom: 50, mr: 10 }}>
          <Button
            component={Link}
            to="/onboarding2"
            variant="contained"
            sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
          >
            <FaChevronLeft /> {t("previous")}{" "}
          </Button>
        </Grid>
        <Grid item md={4} sx={{ position: "fixed", bottom: 50, ml :65 }}>
          <Button
            component={Link}
            to="/messages"
            variant="underlined"
            sx={{ px: 2, textTransform: "none" }}
          >
            {t("skip")}
          </Button>
        </Grid>
        <Grid
          item
          md={4}
          // position="relative"
          justifyContent="flex-end"
          sx={{
            right: 0,
            display: "flex",
            position: "fixed",
            bottom: 50,
            mr: 10,
          }}
        >
          <Button
            component={Link}
            to="/onboarding4"
            variant="contained"
            sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
          >
            {t("next")} <FaChevronRight />{" "}
          </Button>
        </Grid>
      </Grid>
      <AddAccounts open={addAccountsDialogOpen} onClose={handleAddAccountsDialogClose} />
    </Box>
  );
}
