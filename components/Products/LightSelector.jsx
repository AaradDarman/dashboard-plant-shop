import React, { useContext } from "react";

import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import { productContext } from "context/product-context";
import Icon from "components/shared/Icon";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
    sx: {
      bgcolor: "secondary.main",
      "& .MuiMenu-list": {
        padding: 0,
      },
      "& .MuiMenuItem-root:hover": {
        bgcolor: "primary.main",
      },
    },
  },
};

function getStyles(light, value, theme) {
  return `${value != light ? "!bg-primary-900" : "!bg-primary-800"}
  ${value != light ? "" : "!text-accent-600"}`;
}

const LightSelector = ({
  lights,
  onChange,
  value,
  helperText,
  error,
  onBlur,
  className,
}) => {
  const theme = useTheme();
  const { openAddNewLightModal } = useContext(productContext);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    onChange(value);
  };
  return (
    <FormControl margin="dense" className={className}>
      <InputLabel
        required
        sx={{
          "&.Mui-focused": {
            color: "accent.main",
          },
        }}
        error={error}
      >
        نور
      </InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        value={value}
        onChange={handleChange}
        input={
          <OutlinedInput
            required
            error={error}
            onBlur={onBlur}
            sx={{
              "&": {
                minHeight: "65px",
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "accent.main",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "accent.main",
              },
            }}
            id="select-multiple-chip"
            label="نور"
          />
        }
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            <Chip label={selected} />
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {lights.map((light) => (
          <MenuItem
            key={light}
            value={light}
            className={getStyles(light, value, theme)}
          >
            <Checkbox
              checked={value === light}
              sx={{
                "&.Mui-checked": {
                  color: "accent.main",
                },
              }}
            />
            <ListItemText primary={light} />
          </MenuItem>
        ))}
        <button
          className="min-h-[42px] w-full cursor-pointer bg-primary-900 py-[6px] px-[26px]"
          onClick={openAddNewLightModal}
        >
          افزودن شرایط نور جدید
          <Icon icon="add-category" size={22} className="mr-2" />
        </button>
      </Select>
      <FormHelperText error={error} id="inventory-error">
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};

export default LightSelector;
