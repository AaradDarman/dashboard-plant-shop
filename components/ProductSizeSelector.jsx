import React from "react";

import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import PropTypes from "prop-types";

const SizeRadio = ({ size, ...otherProps }) => {
  return (
    <Radio
      sx={{
        "&": {
          padding: "8px",
          border: "1px solid transparent",
          borderRadius: "0.5rem",
        },
      }}
      disableRipple
      color="default"
      checkedIcon={<div>{size}</div>}
      icon={<div>{size}</div>}
      {...otherProps}
    />
  );
};

const ProductSizeSelector = ({
  sizes,
  selectedSize,
  onChange,
  ...otherProps
}) => {
  return (
    <RadioGroup
      aria-labelledby="size-radio-buttons-group"
      // defaultValue={selectedSize}
      name="size-radio-buttons-group"
      row
      value={selectedSize}
      onChange={onChange}
      sx={{
        "& .Mui-checked": {
          border: "1px solid",
          borderColor: "accent.main",
          borderRadius: "0.5rem",
        },
      }}
      {...otherProps}
    >
      {sizes?.map((size) => (
        <FormControlLabel
          key={size}
          value={size}
          control={<SizeRadio className="text-uppercase" size={size} />}
        />
      ))}
    </RadioGroup>
  );
};

ProductSizeSelector.propTypes = {
  sizes: PropTypes.array.isRequired,
  selectedSize: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ProductSizeSelector;
