import React, { useState } from "react";
import { TextField, Button, Box, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function PasswordForm({
  fields,
  activity,
  onSubmit,
  submitButtonText = activity === "change"
    ? "Change Password"
    : "Reset Password",
  submitButtonColor = "primary",
}) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {})
  );

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordToggle = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const validateForm = () => {
    const validationErrors = {};

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        validationErrors[field.name] = `${field.label} is required`;
      }
    });

    if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "450px",
      }}
    >
      {fields.map((field) => (
        <Box key={field.name} sx={{ marginTop: "16px" }}>
          <TextField
            variant="standard"
            label={field.label}
            name={field.name}
            type={showPassword[field.name] ? "text" : "password"}
            value={formData[field.name]}
            onChange={handleFieldChange}
            fullWidth
            required={field.required}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            multiline={field.multiline}
            rows={field.rows || 1}
            slotProps={{
              input: {
                endAdornment: field.type === "password" && (
                  <IconButton
                    onClick={() => handlePasswordToggle(field.name)}
                    edge="end"
                  >
                    {showPassword[field.name] ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                ),
              },
            }}
          />
        </Box>
      ))}

      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          variant="contained"
          color={submitButtonColor}
          onClick={handleSubmit}
        >
          {submitButtonText}
        </Button>
      </Box>
    </Box>
  );
}

export default PasswordForm;
