import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
} from "@mui/material";

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

  const handleSubmit = async () => {
    const validationErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        validationErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setLoading(true);
      await onSubmit(formData, setLoading);
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
        </Box>
      ))}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginTop: "20px" }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Send"
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default ComposeForm;
