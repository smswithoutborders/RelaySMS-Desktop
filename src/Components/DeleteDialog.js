import { useTranslation } from "react-i18next";
import { Box, Typography,Button, Grid } from "@mui/material";



export default function DeleteDialog({ handleCloseDeleteDialog, handleConfirmDelete }) {
    const { t } = useTranslation();
  
    return (
      <Box sx={{ p: 3, backgroundColor: "#FF312E", width: "100%" }}>
        <Typography>{t("deleteAccount")}</Typography>
        <br />
        <Typography sx={{ fontWeight: 600 }}>{t("deletetext")}</Typography>
        <br />
        <Typography>{t("deleteAccountConfirmation")}</Typography>
        <Grid container sx={{ pt: 2 }} columnGap={4}>
          <Button
            component={Grid}
            variant="contained"
            item
            sm={4}
            sx={{ borderRadius: 3 }}
            onClick={handleCloseDeleteDialog}
          >
            {t("no")}
          </Button>
          <Button
            component={Grid}
            variant="contained"
            item
            sm={4}
            sx={{ borderRadius: 3 }}
            onClick={handleConfirmDelete}
            color="primary"
          >
            {t("yes")}
          </Button>
        </Grid>
      </Box>
    );
  }
  