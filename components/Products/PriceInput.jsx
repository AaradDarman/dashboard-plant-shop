import React from "react";

import { FilledInput, Input } from "@mui/material";
import { styled as MuiStyled } from "@mui/material/styles";
import { NumericFormat } from "react-number-format";

const StyledInput = MuiStyled(FilledInput)(({ theme }) => ({
  "& .MuiFilledInput-input": {
    padding: "12px 4px",
    textAlign: "center",
  },
  "&.MuiFilledInput-root:after": {
    borderColor: theme.palette.accent.main,
  },
  "&.MuiFilledInput-root.Mui-error:after": {
    borderColor: theme.palette.error.main,
  },
}));

const MIN_LIMIT = 0;

const PriceInput = ({ onChange, value, error }) => {
  const handlePriceChange = (vals) => {
    onChange(vals.floatValue);
  };

  return (
    <NumericFormat
      error={error}
      customInput={StyledInput}
      variant="standard"
      valueIsNumericString={true}
      thousandSeparator={true}
      value={value}
      decimalScale={0}
      onValueChange={(vals) => handlePriceChange(vals)}
      min="0"
      isAllowed={(values) => {
        const { floatValue } = values;
        return floatValue > MIN_LIMIT || floatValue === undefined;
      }}
    />
  );
};

export default React.memo(PriceInput);
