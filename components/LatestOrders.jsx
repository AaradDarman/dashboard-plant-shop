import {
  Checkbox,
  FormControlLabel,
  Icon,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { orderContext } from "context/order-context";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import { getOrders } from "redux/slices/orders";
import styled from "styled-components";
import { styled as muiStyled } from "@mui/system";
import { visuallyHidden } from "@mui/utils";
import { getPersianDate } from "utils/date-helper";
import { getRecentOrders } from "redux/slices/analytics";
import { rgba } from "polished";
import { numberWithCommas } from "utils/number-helper";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "وضعیت",
  },
  {
    id: "orderNumber",
    numeric: true,
    disablePadding: false,
    label: "شماره سفارش",
  },
  {
    id: "totalPrice",
    numeric: true,
    disablePadding: false,
    label: "مبلغ کل",
  },
  {
    id: "client",
    numeric: true,
    disablePadding: false,
    label: "مشتری",
  },
  {
    id: "createAt",
    numeric: true,
    disablePadding: false,
    label: "تاریخ",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.id === "status" ? "left" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  return (
    <Typography variant="h6" id="tableTitle" component="h2" className="!my-3">
      سفارش های اخیر
    </Typography>
  );
}

function EnhancedTableRow({ children, ...otherProps }) {
  return <TableRow {...otherProps}>{children}</TableRow>;
}

const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.23)",
    padding: "0.5rem",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderColor: "rgba(255, 255, 255, 0.23)",
    padding: "0.5rem",
  },
}));

const optionsCase = {
  "wait-for-pay": "در انتظار پرداخت",
  "in-progress": "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

const statusColor = {
  "wait-for-pay": "#2e2e2e",
  "in-progress": "#a47d06",
  shipped: "#0ea5e9",
  delivered: "#16a34a",
  cancelled: "#db3131",
};

const LatestOrders = () => {
  const dispatch = useDispatch();
  const { recentOrders } = useSelector((state) => state.analytics);
  const theme = useTheme();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createAt");

  useEffect(() => {
    dispatch(
      getRecentOrders({
        page: 1,
        search: "",
        sortBy: orderBy,
        desc: order === "desc" ? true : false,
        itemsPerPage: 14,
      })
    );
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Avoid a layout jump when reaching the last page with empty rows.

  return (
    <Paper
      className="py-2 px-2 xl:px-5"
      sx={{
        width: "100%",
        backgroundColor: "transparent",
        backgroundImage: "none",
        boxShadow: "none",
      }}
    >
      <EnhancedTableToolbar />
      <TableContainer sx={{ minHeight: 600, position: "relative" }}>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {recentOrders.status === "loading" ? (
              <PulseLoader
                size={6}
                color={theme.palette.accent.main}
                loading={true}
                className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]"
              />
            ) : recentOrders.entity.length == 0 ? (
              <span className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] text-[14px] text-gray-400">
                سفارش جدیدی ثبت نشده است
              </span>
            ) : (
              stableSort(
                recentOrders.entity,
                getComparator(order, orderBy)
              ).map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <EnhancedTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row._id}
                  >
                    <StyledTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <div className="flex items-center text-[12px]">
                        <span
                          style={{
                            backgroundColor: rgba(statusColor[row.status], 0.2),
                            color: statusColor[row.status],
                            inlineSize: "max-content",
                          }}
                          className="rounded-md p-2"
                        >
                          {optionsCase[row.status]}
                        </span>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.orderNumber}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {numberWithCommas(row.totalPrice)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {`${row?.client?.fName} ${row?.client?.lName}`}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {getPersianDate(row.createAt)}
                    </StyledTableCell>
                  </EnhancedTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default LatestOrders;
