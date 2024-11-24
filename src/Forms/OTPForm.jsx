import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";

function OTPForm({
  fields,
  twoStepVerificationEnabled,
  onSubmit,
  description,
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const initialData = fields.reduce((acc, field) => {
      acc[field.name] =
        field.defaultValue || (field.type === "phone" ? "" : "");
      return acc;
    }, {});
    setFormData(initialData);
  }, [fields]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value, name) => {
    const cleanedValue = value.replace(/\s+/g, "");
    setFormData((prevData) => ({
      ...prevData,
      [name]: cleanedValue,
    }));
  };

  const validateForm = () => {
    const validationErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      if (field.required && !value) {
        validationErrors[field.name] = `${field.label} is required`;
      }

      if (field.type === "phone" && value && !matchIsValidTel(value)) {
        validationErrors[field.name] = "Please enter a valid phone number";
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "450px",
      }}
    >
      {description && (
        <Alert severity="info" sx={{ marginBottom: "16px" }}>
          {description}
        </Alert>
      )}

      {fields.map((field) => {
        if (field.name === "password" && !twoStepVerificationEnabled) {
          return null;
        }

        return (
          <Box key={field.name} sx={{ marginTop: "16px" }}>
            {field.type === "phone" ? (
              <MuiTelInput
                fullWidth
                defaultCountry="CM"
                forceCallingCode
                focusOnSelectCountry
                variant="standard"
                label={field.label}
                value={formData[field.name] || ""}
                onChange={(value) => handlePhoneChange(value, field.name)}
                required={field.required}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                disabled={loading}
                sx={{
                  py: 2,
                  "& .MuiInput-root": {
                    borderRadius: 4,
                    backgroundColor: "background.default",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  },
                }}
              />
            ) : (
              <TextField
                variant="standard"
                label={field.label}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleFieldChange}
                fullWidth
                required={field.required}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                type={
                  field.name === "password" && showPassword
                    ? "text"
                    : field.type || "text"
                }
                multiline={field.multiline}
                rows={field.rows || 1}
                disabled={loading}
                slotProps={{
                  input: {
                    endAdornment: field.type === "password" && (
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  },
                }}
              />
            )}
          </Box>
        );
      })}

      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : null
          }
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </Box>
    </Box>
  );
}

export default OTPForm;
