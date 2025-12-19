import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../Contexts/LanguageContext";
import { Box, MenuItem, Select, FormControl } from "@mui/material";

export default function LanguageList() {
  const { language, changeLanguage, languages } = useLanguage();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
       mx: 2,
       mt: 2
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 300 }}>
        <FormControl fullWidth variant="standard">
          <Select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            {languages.map((code) => (
              <MenuItem key={code} value={code}>
                {t(`languages.${code}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
