import React, { useContext, useEffect, useRef, useState } from "react";

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  tableRowClasses,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { alpha, styled as muiStyled } from "@mui/system";
import Icon from "components/shared/Icon";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader, MoonLoader } from "react-spinners";
import styled from "styled-components";
import { inventoryContext } from "context/inventory-context";
import { visuallyHidden } from "@mui/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import EnhancedTableHead from "components/shared/EnhancedTableHead";
import { StyledTableCell } from "components/shared/StyledTableCell";
import { customersContext } from "context/customers-context";
import { getPersianDate, getPersianDateWithTime } from "utils/date-helper";
import { numberWithCommas } from "utils/number-helper";
import SearchInput from "components/shared/SearchInput";
import { getRecentTransactions, getTopProducts } from "redux/slices/statistics";
import useInfiniteScroll from "components/hooks/useInfiniteScroll";
import { statisticsContext } from "context/statistics-context";
import { useDebounce } from "components/hooks/useDebounce";

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
    id: "orderNumber",
    disablePadding: false,
    label: "شماره سفارش",
    align: "left",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "مبلغ",
  },
  {
    id: "status",
    disablePadding: false,
    label: "وضعیت",
  },
  {
    id: "trackingNumber",
    numeric: true,
    disablePadding: false,
    label: "شماره پیگیری",
  },
  {
    id: "paidAt",
    disablePadding: false,
    label: "تاریخ پرداخت",
  },
];

function EnhancedTableToolbar(props) {
  const { search, setSearch } = props;

  return (
    <Toolbar
      sx={{
        padding: "0 8px !important",
      }}
      className="!min-h-fit"
    >
      <Typography variant="h6" className="!text-[16px]">
        تراکنش های اخیر
      </Typography>
      <SearchInput
        className="my-2 !mr-auto !rounded-md border-[1px] border-secondary-dark-800 !bg-transparent"
        value={search}
        onChange={(val) => {
          setSearch(val);
        }}
        placeholder="شماره پیگیری را وارد کنید ..."
      />
    </Toolbar>
  );
}

function EnhancedTableRow({ selected, children, ...otherProps }) {
  return (
    <TableRow
      {...otherProps}
      sx={{
        bgcolor: (theme) =>
          selected &&
          alpha(
            theme.palette.accent.main,
            theme.palette.action.activatedOpacity
          ),
      }}
    >
      {children}
    </TableRow>
  );
}

const ToBeStyledTooltip = ({ className, ...props }) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
);
const StyledTooltip = muiStyled(ToBeStyledTooltip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const RecentTransactions = ({ className }) => {
  const theme = useTheme();
  const { entity, status, totalCount } = useSelector(
    (state) => state.statistics.recentTransactions
  );
  const {
    recentTransactionsOrder,
    setRecentTransactionsOrder,
    recentTransactionsOrderBy,
    setRecentTransactionsOrderBy,
    recentTransactionsSearch,
    setRecentTransactionsSearch,
    recentTransactionsRowsPerPage,
  } = useContext(statisticsContext);

  const dispatch = useDispatch();
  const parentRef = useRef(null);

  const handleRequestSort = (event, property) => {
    const isAsc =
      recentTransactionsOrderBy === property &&
      recentTransactionsOrder === "asc";
    setRecentTransactionsOrder(isAsc ? "desc" : "asc");
    setRecentTransactionsOrderBy(property);
  };

  const handleScrollEnd = () => {
    dispatch(
      getRecentTransactions({
        search: "",
        sortBy: recentTransactionsOrderBy,
        desc: recentTransactionsOrder === "desc" ? true : false,
        itemsPerPage: recentTransactionsRowsPerPage,
        skip: entity.length,
      })
    )
      .unwrap()
      .then(() => {
        setIsFetching(false);
      });
  };

  const [isFetching, setIsFetching] = useInfiniteScroll(
    parentRef,
    handleScrollEnd,
    entity.length === totalCount
  );

  let debouncedSeasrchTerm = useDebounce(recentTransactionsSearch, 500);

  useEffect(() => {
    dispatch(
      getRecentTransactions({
        search: debouncedSeasrchTerm,
        sortBy: recentTransactionsOrderBy,
        desc: recentTransactionsOrder === "desc" ? true : false,
        itemsPerPage: recentTransactionsRowsPerPage,
        skip: entity.length,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSeasrchTerm,
    recentTransactionsOrderBy,
    recentTransactionsOrder,
  ]);

  return (
    <div
      className={`${className} relative flex flex-col rounded-[4px] border-[1px] border-secondary-dark-800`}
    >
      <EnhancedTableToolbar
        theme={theme}
        search={recentTransactionsSearch}
        setSearch={setRecentTransactionsSearch}
      />
      <TableContainer
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          mb: "12px",
          backgroundColor: "transparent",
          backgroundImage: "none",
          boxShadow: "none",
          padding: "0 8px",
          direction: "rtl",
        }}
        ref={parentRef}
      >
        <Table size="small" stickyHeader sx={{ "&": { direction: "ltr" } }}>
          <EnhancedTableHead
            order={recentTransactionsOrder}
            orderBy={recentTransactionsOrderBy}
            onRequestSort={handleRequestSort}
            headCells={headCells}
          />
          <TableBody>
            {status === "loading" && entity.length === 0 ? (
              <PulseLoader
                size={6}
                color={theme.palette.accent.main}
                loading={true}
                className="absolute top-[50%] left-[50%] z-10 -translate-y-[50%] -translate-x-[50%]"
              />
            ) : entity.length == 0 ? (
              <span className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] text-[14px] text-gray-400">
                تراکنشی یافت نشد
              </span>
            ) : (
              stableSort(
                entity,
                getComparator(
                  recentTransactionsOrder,
                  recentTransactionsOrderBy
                )
              ).map((item, index) => {
                const itemId = item._id;
                return (
                  <EnhancedTableRow
                    hover
                    tabIndex={-1}
                    key={itemId}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <StyledTableCell align="left" className="xl:!pr-[26px]">
                      {item.orderNumber}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {numberWithCommas(item.price)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.status}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.trackingNumber}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ direction: "rtl !important" }}
                    >
                      {getPersianDateWithTime(item.paidAt)}
                    </StyledTableCell>
                  </EnhancedTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {isFetching && (
          <MoonLoader
            size={20}
            color={theme.palette.accent.main}
            loading={true}
            cssOverride={{
              left: "50%",
              position: "absolute",
              marginTop: "10px",
            }}
          />
        )}
      </TableContainer>
    </div>
  );
};

export default RecentTransactions;
