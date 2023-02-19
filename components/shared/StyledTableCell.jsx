import { TableCell, tableCellClasses } from "@mui/material";
import { styled as muiStyled } from "@mui/system";

export const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    borderColor: "rgba(255, 255, 255, 0.23)",
    padding: "6px 0",
    [theme.breakpoints.up("xl")]: {
      padding: "6px 16px",
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderColor: "rgba(255, 255, 255, 0.23)",
    padding: "6px 0",
    [theme.breakpoints.up("xl")]: {
      padding: "6px 16px",
    },
  },
}));
