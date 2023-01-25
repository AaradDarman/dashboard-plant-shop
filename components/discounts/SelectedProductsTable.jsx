import React, { useContext, useEffect } from "react";

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  tableRowClasses,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { styled as muiStyled } from "@mui/system";
import Icon from "components/shared/Icon";
import { discountsContext } from "context/discounts-context";

const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    borderColor: "rgba(255, 255, 255, 0.23)",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderColor: "rgba(255, 255, 255, 0.23)",
  },
}));

const StyledTableRow = muiStyled(TableRow)(({ theme }) => ({
  //   [`&.${tableRowClasses.head}`]: {
  //     backgroundColor: "transparent",
  //     borderColor: "rgba(255, 255, 255, 0.23)",
  //   },
  //   [`&.${tableRowClasses.body}`]: {
  //     fontSize: 14,
  //     borderColor: "rgba(255, 255, 255, 0.23)",
  //   },
}));

const SelectedProductsTable = ({ items, onRemoveItem }) => {
  const theme = useTheme();

  useEffect(() => {
    console.log(items);
  }, [items]);
  return (
    <TableContainer
      sx={{
        width: "100%",
        height: "100%",
        mb: "12px",
        backgroundColor: "transparent",
        backgroundImage: "none",
        boxShadow: "none",
      }}
      component={Paper}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <StyledTableRow sx={{ bgcolor: "primary.main" }}>
            <StyledTableCell align="center">نام</StyledTableCell>
            <StyledTableCell align="center">سایز</StyledTableCell>
            <StyledTableCell align="center">موجودی</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <StyledTableRow
              key={`${item}-${index}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell align="center">{item.name}</StyledTableCell>
              <StyledTableCell align="center">{item.size}</StyledTableCell>
              <StyledTableCell align="center">{item.quantity}</StyledTableCell>
              <StyledTableCell
                align="center"
                sx={{ padding: 0, display: "flex", justifyContent: "center" }}
              >
                <Image
                  src={item.images[0]}
                  alt="product-pic"
                  width={45}
                  height={45}
                />
                <IconButton onClick={() => onRemoveItem(item)}>
                  <Icon
                    icon="delete"
                    size={22}
                    color={theme.palette.error.main}
                  />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SelectedProductsTable;
