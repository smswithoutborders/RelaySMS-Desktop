import { Box, Button, TextField } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import React from "react";

function LoginForm() {
  return (
    <Box>
      <MuiTelInput />
      <TextField label="password" variant="standard" />

      <Button>Submit</Button>
    </Box>
  );
}

export default LoginForm;
