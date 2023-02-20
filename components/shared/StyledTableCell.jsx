import { TableCell, tableCellClasses } from "@mui/material";
import { styled as muiStyled } from "@mui/system";

export const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    borderColor: "rgba(255, 255, 255, 0.23)",
    padding: "6px",
    fontSize: 12,
    [theme.breakpoints.up("xl")]: {
      padding: "6px 16px",
    },
    [theme.breakpoints.up("xs")]: {
      fontSize: 14,
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    borderColor: "rgba(255, 255, 255, 0.23)",
    padding: "6px",
    [theme.breakpoints.up("xl")]: {
      padding: "6px 16px",
    },
    [theme.breakpoints.up("xs")]: {
      fontSize: 14,
    },
  },
}));
