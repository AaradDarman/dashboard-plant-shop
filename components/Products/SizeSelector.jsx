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
import _ from "lodash";
import Icon from "components/shared/Icon";
import { productContext } from "context/product-context";

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

function getStyles(size, values, theme) {
  return `${values.indexOf(size) === -1 ? "!bg-primary-900" : "!bg-primary-800"}
  ${values.indexOf(size) === -1 ? "" : "!text-accent-600"}`;
}

const SizeSelector = ({
  sizes,
  onChange,
  values,
  helperText,
  error,
  onBlur,
  className,
}) => {
  const theme = useTheme();
  const { openAddNewSizeModal } = useContext(productContext);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    onChange(value);
  };

  return (
    <FormControl margin="dense" className={className}>
      <InputLabel
        error={error}
        sx={{
          "&.Mui-focused": {
            color: "accent.main",
          },
        }}
        id="demo-multiple-chip-label"
        required
      >
        سایز
      </InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={values}
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
            label="سایز"
          />
        }
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={JSON.parse(value).label}
                label={JSON.parse(value).label}
              />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {sizes.map((size) => {
          return (
            <MenuItem
              key={size.label}
              value={JSON.stringify(size)}
              className={getStyles(JSON.stringify(size), values, theme)}
            >
              <Checkbox
                checked={values
                  .map((val) => JSON.parse(val).label)
                  .includes(size.label)}
                sx={{
                  "&.Mui-checked": {
                    color: "accent.main",
                  },
                }}
              />
              <ListItemText primary={size.label} />
            </MenuItem>
          );
        })}
        <button
          className="min-h-[42px] w-full cursor-pointer bg-primary-900 py-[6px] px-[26px]"
          onClick={openAddNewSizeModal}
        >
          افزودن سایز جدید
          <Icon icon="height" size={22} className="mr-2" />
        </button>
      </Select>
      <FormHelperText error={error} id="inventory-error">
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};

export default SizeSelector;
