import { Box, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { StyledTableCell } from "./StyledTableCell";

const EnhancedTableHead = ({ order, orderBy, onRequestSort, headCells }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ bgcolor: "primary.main" }}>
        {headCells.map((headCell) =>
          headCell.label != "" ? (
            <StyledTableCell
              key={headCell.id}
              align={headCell.align ?? "center"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                className="!-translate-x-3"
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </StyledTableCell>
          ) : (
            <StyledTableCell key={headCell.id}></StyledTableCell>
          )
        )}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;
