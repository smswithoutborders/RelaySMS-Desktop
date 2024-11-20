import React, { useState, useEffect } from "react";
import { TextField, Button, Box, MenuItem } from "@mui/material";

function ComposeForm({ fields, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

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

  const handleSubmit = () => {
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
      onSubmit(formData);
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
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default ComposeForm;
