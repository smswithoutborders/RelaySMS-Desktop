import { Typography, Box, Grid } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Onboarding3() {
  const { t } = useTranslation();

  return (
    <Box sx={{ px: 5, py: 7, overflow: "none" }}>
     

      <Grid container>
        <Grid item md={6} sm={6} sx={{ py: 10 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t("done")}
          </Typography>
          <Typography variant="h6" sx={{ opacity: "70%", pt: 10 }}>
            {t("tourComplete")}
          </Typography>
          
        </Grid>
        <Grid item md={6} sm={6}>
          <Box component="img" src="popper.png" sx={{ width: "80%" }} />
        </Grid>
      </Grid>
    </Box>
  );
}
