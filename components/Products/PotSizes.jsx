import React, { useEffect } from "react";

import {
  FilledInput,
  FormHelperText,
  Input,
  InputBase,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PriceInput from "./PriceInput";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.23)",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&": {
    backgroundColor: "transparent",
  },
  [theme.breakpoints.up("md")]: {
    "& td, th": {
      padding: "6px 16px",
    },
  },
  "& td, th": {
    borderColor: "rgba(255, 255, 255, 0.23)",
    padding: "6px",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const PotSizes = ({ sizes, onChange, error, className }) => {
  const handleDiameterChange = (size, diameter) => {
    const sizesClone = [...sizes.map((size) => JSON.parse(size))];
    const targetIndex = sizesClone.findIndex((obj) => obj.label === size);
    sizesClone[targetIndex].diameter = diameter;
    onChange(sizesClone.map((size) => JSON.stringify(size)));
  };

  const handleHeightChange = (size, height) => {
    const sizesClone = [...sizes.map((size) => JSON.parse(size))];
    const targetIndex = sizesClone.findIndex((obj) => obj.label === size);
    sizesClone[targetIndex].height = height;
    onChange(sizesClone.map((size) => JSON.stringify(size)));
  };

  return (
    <div className={className}>
      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid",
          borderColor: error ? "error.main" : "rgba(255, 255, 255, 0.23)",
          backgroundColor: "transparent",
          backgroundImage: "none",
          marginTop: "8px",
          marginBottom: "4px",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">#</StyledTableCell>
              <StyledTableCell align="center">سایز</StyledTableCell>
              <StyledTableCell align="center">
                قطر گلدان
                <span className="MuiFormLabel-asterisk MuiInputLabel-asterisk muirtl-1c5otfm-MuiFormLabel-asterisk">
                   *
                </span>
              </StyledTableCell>
              <StyledTableCell align="center">
                ارتفاع
                <span className="MuiFormLabel-asterisk MuiInputLabel-asterisk muirtl-1c5otfm-MuiFormLabel-asterisk">
                   *
                </span>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sizes.map((size, index) => (
              <StyledTableRow key={JSON.parse(size).label}>
                <StyledTableCell align="center" component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {JSON.parse(size).label}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <FilledInput
                    error={error}
                    inputProps={{
                      style: { padding: "12px 4px", textAlign: "center" },
                      min: 0,
                    }}
                    type="number"
                    variant="standard"
                    size="small"
                    sx={{
                      "&.MuiFilledInput-root:after": {
                        borderColor: "accent.main",
                      },
                      "&.MuiFilledInput-root.Mui-error:after": {
                        borderColor: "error.main",
                      },
                    }}
                    value={JSON.parse(size)?.diameter}
                    onChange={(e) =>
                      handleDiameterChange(
                        JSON.parse(size).label,
                        +e.target.value
                      )
                    }
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <FilledInput
                    error={error}
                    inputProps={{
                      style: { padding: "12px 4px", textAlign: "center" },
                      min: 0,
                    }}
                    type="number"
                    variant="standard"
                    size="small"
                    sx={{
                      "&.MuiFilledInput-root:after": {
                        borderColor: "accent.main",
                      },
                      "&.MuiFilledInput-root.Mui-error:after": {
                        borderColor: "error.main",
                      },
                    }}
                    value={JSON.parse(size)?.height}
                    onChange={(e) =>
                      handleHeightChange(
                        JSON.parse(size).label,
                        +e.target.value
                      )
                    }
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PotSizes;
