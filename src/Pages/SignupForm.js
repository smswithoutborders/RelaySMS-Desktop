import { CheckBox } from "@mui/icons-material";
import { Box, Button, FormControlLabel, TextField } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import React from "react";

function SignupForm() {
  return (
    <Box>
      <MuiTelInput />
      <TextField label="password" variant="standard" />
      <TextField label="repeat password" variant="standard" />
      <FormControlLabel
        contr={<CheckBox name="accept privacy policy" />}
        label={<span>accept privacy policy</span>}
      />
      <Button>Submit</Button>
    </Box>
  );
}

export default SignupForm;
