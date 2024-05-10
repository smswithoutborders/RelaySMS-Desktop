import { Typography, Box, Grid, Button } from "@mui/material";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function IntroducingVaults() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <Box sx={{ px: 10, mt: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Introducting Vaults
        </Typography>
      </Box>

      <Box
        my="auto"
        justifyContent="center"
        sx={{
          px: 10,
          pr: { md: 50, sm: 5 },
        }}
      >
        <Typography variant="h4">
          Vaults keep access to your online accounts safe while you are offline
        </Typography>
        <Typography variant="h6" sx={{ py: 5, opacity: "70%" }}>
          SMSWithoutBorders uses the standardized methods provided by the online
          platforms both utilizing and securing your information stored in
          vaults
        </Typography>
        <Box sx={{ py: 5 }}>
          <Button variant="contained" sx={{ borderRadius: 5, px: 2 }}>
            {" "}
            Try Example
          </Button>
        </Box>
      </Box>

      <Box
        component="footer"
        justifyContent="center"
        sx={{
          px: 10,
        }}
      >
        <Grid container>
          <Grid item md={6} sx={{ position: "fixed", bottom: 50, mr: 10 }}>
            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{ borderRadius: 5, px: 2 }}
            >
              <FaChevronLeft /> Previous{" "}
            </Button>
          </Grid>
          <Grid
            item
            md={6}
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
              to="/done"
              variant="contained"
              sx={{ borderRadius: 5, px: 2 }}
            >
              Next <FaChevronRight />{" "}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
