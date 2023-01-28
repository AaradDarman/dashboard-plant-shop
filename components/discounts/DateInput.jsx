import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { isEmpty } from "lodash";
import React from "react";

const DateInput = ({
  openCalendar,
  stringDate,
  clearDate,
  isDatePickerOpen,
  ...otherProps
}) => {
  return (
    <TextField
      autoComplete="off"
      margin="dense"
      size="small"
      onFocus={openCalendar}
      focused={isDatePickerOpen}
      label="تاریخ"
      type="text"
      fullWidth
      {...otherProps}
      required
      variant="outlined"
      value={stringDate}
      sx={(theme) => ({
        marginBottom: "1rem",
        width: "245px",
        [theme.breakpoints.up("md")]: {
          width: "270px",
        },
        "& label.Mui-focused": {
          color: "accent.main",
        },
        "& label.Mui-focused.Mui-error": {
          color: "error.main",
        },
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: "accent.main",
          },
          "&.MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "error.main",
            },
        },
      })}
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            style={{ visibility: isEmpty(stringDate) ? "hidden" : "visible" }}
          >
            <IconButton
              onClick={clearDate}
              className="!text-[15px]"
              aria-label="delete"
            >
              <FontAwesomeIcon icon={faXmark} width={15} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default DateInput;
