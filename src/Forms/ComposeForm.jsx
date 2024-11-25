import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";

function ComposeForm({ fields, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialData = fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
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

  const handleSubmit = async () => {
    const validationErrors = {};
    fields.forEach((field) => {
      const value = formData[field.name];
      if (field.required && !value) {
        validationErrors[field.name] = `${field.label} is required`;
      }

      if (field.type === "tel" && value && !matchIsValidTel(value)) {
        validationErrors[field.name] = "Please enter a valid phone number";
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setLoading(true);
      try {
        await onSubmit(formData);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "600px",
        padding: "8px",
        overflow: "auto",
        boxSizing: "border-box",
      }}
    >
      {fields.map((field) => (
        <Box key={field.name}>
          {field.type === "tel" ? (
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
              select={field.type === "select"}
              variant="standard"
              label={field.label}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleFieldChange}
              fullWidth
              required={field.required}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
              type={field.type || "text"}
              multiline={field.multiline}
              rows={field.rows || 1}
              disabled={loading}
            >
              {field.type === "select" &&
                field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </TextField>
          )}
        </Box>
      ))}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginTop: "20px" }}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : null
          }
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </Box>
    </Box>
  );
}

export default ComposeForm;
