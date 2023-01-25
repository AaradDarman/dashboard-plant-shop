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

function getStyles(category, values, theme) {
  return `${
    values.indexOf(category) === -1 ? "!bg-primary-900" : "!bg-primary-800"
  }
  ${values.indexOf(category) === -1 ? "" : "!text-accent-600"}`;
}

const CategorySelector = ({
  categories,
  onChange,
  values,
  helperText,
  error,
  onBlur,
}) => {
  const theme = useTheme();
  const { openAddNewCategoryModal } = useContext(productContext);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    onChange(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  return (
    <FormControl margin="dense">
      <InputLabel
        required
        sx={{
          "&.Mui-focused": {
            color: "accent.main",
          },
        }}
        error={error}
      >
        دسته بندی
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
            label="دسته بندی"
          />
        }
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {categories.map((category) => (
          <MenuItem
            key={category._id}
            value={category.name}
            className={getStyles(category.name, values, theme)}
          >
            <Checkbox
              checked={values.indexOf(category.name) > -1}
              sx={{
                "&.Mui-checked": {
                  color: "accent.main",
                },
              }}
            />
            <ListItemText primary={category.name} />
          </MenuItem>
        ))}
        <button
          className="min-h-[42px] w-full cursor-pointer bg-primary-900 py-[6px] px-[26px]"
          onClick={openAddNewCategoryModal}
        >
          افزودن دسته بندی جدید
          <Icon icon="add-category" size={22} className="mr-2" />
        </button>
      </Select>
      <FormHelperText error={error} id="inventory-error">
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};

export default CategorySelector;
