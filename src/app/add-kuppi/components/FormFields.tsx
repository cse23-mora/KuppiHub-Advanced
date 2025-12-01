"use client";

import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import { FormData } from "./types";

interface FormFieldsProps {
  formData: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export default function FormFields({ formData, onChange }: FormFieldsProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2.5, sm: 3 } }}>
      {/* Content Type */}
      <FormControl component="fieldset">
        <FormLabel 
          component="legend" 
          sx={{ 
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            fontWeight: 500,
            color: "#374151",
            mb: 0.5,
          }}
        >
          Content Type
        </FormLabel>
        <RadioGroup
          row
          value={formData.isKuppi ? "kuppi" : "material"}
          onChange={(e) => onChange({ isKuppi: e.target.value === "kuppi" })}
        >
          <FormControlLabel 
            value="kuppi" 
            control={<Radio size="small" />} 
            label="Kuppi Video"
            sx={{ 
              "& .MuiFormControlLabel-label": { 
                fontSize: { xs: "0.8rem", sm: "0.875rem" } 
              } 
            }}
          />
          <FormControlLabel 
            value="material" 
            control={<Radio size="small" />} 
            label="Notes / Papers / Materials"
            sx={{ 
              "& .MuiFormControlLabel-label": { 
                fontSize: { xs: "0.8rem", sm: "0.875rem" } 
              } 
            }}
          />
        </RadioGroup>
      </FormControl>

      {/* Title */}
      <TextField
        fullWidth
        required
        label="Title"
        value={formData.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="e.g., Data Structures - Linked Lists Explained"
        inputProps={{ maxLength: 200 }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      {/* Description */}
      <TextField
        fullWidth
        required
        label="Description"
        multiline
        rows={3}
        value={formData.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Describe what this kuppi covers, topics included, etc."
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      {/* Language and Index Number row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: { xs: 2.5, sm: 3 } }}>
        {/* Language */}
        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            value={formData.languageCode}
            label="Language"
            onChange={(e) => onChange({ languageCode: e.target.value })}
            sx={{
              borderRadius: 2,
            }}
          >
            <MenuItem value="si">Sinhala</MenuItem>
            <MenuItem value="ta">Tamil</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </FormControl>

        {/* Index Number */}
        <TextField
          fullWidth
          label="Student Index Number"
          value={formData.indexNo}
          onChange={(e) => onChange({ indexNo: e.target.value })}
          placeholder="e.g., 210001A"
          helperText="Optional - used to link to your profile"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
            "& .MuiFormHelperText-root": {
              fontSize: { xs: "0.65rem", sm: "0.75rem" },
              mt: 0.5,
            },
          }}
        />
      </Box>
    </Box>
  );
}
