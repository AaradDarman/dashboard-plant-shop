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

const StockInput = ({
  sizes,
  inventory,
  onChange,
  error,
  helperText,
  className,
}) => {
  const handlePriceChange = (size, price) => {
    const inventoryClone = [...JSON.parse(JSON.stringify(inventory))];
    const targeyIndex = inventoryClone.findIndex((obj) => obj.size === size);
    inventoryClone[targeyIndex].price = price;
    onChange(inventoryClone);
  };

  const handleQuantityChange = (size, quantity) => {
    const inventoryClone = [...JSON.parse(JSON.stringify(inventory))];
    const targeyIndex = inventoryClone.findIndex((obj) => obj.size === size);
    inventoryClone[targeyIndex].quantity = quantity;
    onChange(inventoryClone);
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
                قیمت
                <span className="MuiFormLabel-asterisk MuiInputLabel-asterisk muirtl-1c5otfm-MuiFormLabel-asterisk">
                   *
                </span>
              </StyledTableCell>
              <StyledTableCell align="center">
                تعداد
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
                  <PriceInput
                    error={error}
                    value={
                      inventory.find(
                        (obj) => obj.size === JSON.parse(size).label
                      )?.price
                    }
                    onChange={(price) =>
                      handlePriceChange(JSON.parse(size).label, price)
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
                    value={
                      inventory.find(
                        (obj) => obj.size === JSON.parse(size).label
                      )?.quantity
                    }
                    onChange={(e) =>
                      handleQuantityChange(
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
      <FormHelperText error={error} id="images-error" className="!mx-[14px]">
        {helperText}
      </FormHelperText>
    </div>
  );
};

export default StockInput;
