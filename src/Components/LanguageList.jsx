import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../Contexts/LanguageContext";
import { Button, Container, Box } from "@mui/material";

export default function LanguageList() {
  const { language, changeLanguage, languages } = useLanguage();
  const { t } = useTranslation();

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 4,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexWrap: "wrap",
          flexDirection: "column",
        }}
      >
        {languages.map((code) => (
          <Button
            key={code}
            onClick={() => changeLanguage(code)}
            variant={language === code ? "contained" : "outlined"}
            color={language === code ? "primary" : "default"}
            sx={{
              borderRadius: "20px",
              px: 3,
              py: 1,
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {t(`languages.${code}`)}
          </Button>
        ))}
      </Box>
    </Container>
  );
}
