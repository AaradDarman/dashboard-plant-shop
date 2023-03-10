import React, { useContext, useEffect, useRef } from "react";

import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import {
  alpha,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { styled as muiStyled } from "@mui/system";
import Image from "next/image";
import styled from "styled-components";
import { PulseLoader } from "react-spinners";
import ReactToPrint from "react-to-print";

import { getOrders } from "redux/slices/orders";
import MainLayout from "components/layouts/MainLayout";
import Icon from "components/shared/Icon";
import OrdersToPrint from "components/orders/OrdersToPrint";
import { getPersianDate } from "utils/date-helper";
import { numberWithCommas } from "utils/number-helper";
import inProgressImg from "public/images/order-process.png";
import waitForPayImg from "public/images/order-wait-for-pay.png";
import deliveredImg from "public/images/order-delivered.png";
import shippedImg from "public/images/order-shipped.png";
import cancelledImg from "public/images/order-cancelled.png";
import OrderContext from "context/OrderContext";
import { orderContext } from "context/order-context";
import Cookies from "cookies";
import SearchInput from "components/shared/SearchInput";
import { useDebounce } from "components/hooks/useDebounce";
import { StyledTableCell } from "components/shared/StyledTableCell";

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

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
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
    label: "??????????",
  },
  {
    id: "orderNumber",
    numeric: true,
    disablePadding: false,
    label: "?????????? ??????????",
  },
  {
    id: "totalPrice",
    numeric: true,
    disablePadding: false,
    label: "???????? ????",
  },
  {
    id: "client",
    numeric: true,
    disablePadding: false,
    label: "??????????",
  },
  {
    id: "createAt",
    numeric: true,
    disablePadding: false,
    label: "??????????",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell padding="checkbox" align="center">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
            sx={{
              padding: "4px",
              "&.Mui-checked": {
                color: (theme) =>
                  theme.palette.mode === "dark" ? "accent.main" : "accent.600",
              },
              "&.MuiCheckbox-indeterminate": {
                color: (theme) =>
                  theme.palette.mode === "dark" ? "accent.main" : "accent.600",
              },
            }}
          />
        </StyledTableCell>
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
  const {
    numSelected,
    selected,
    search,
    setSearch,
    isLoading,
    count,
    setOnlyInProgress,
    handleCancelOrder,
    handleSendOrder,
    onlyInProgress,
    contentForPrintElem,
    theme,
    setPage,
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.accent.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          color="inherit"
          variant="subtitle1"
          component="div"
          className="!ml-auto"
        >
          {numSelected} ???????????? ??????
        </Typography>
      ) : (
        <Typography variant="h6" id="tableTitle" component="div">
          ?????????? ????
        </Typography>
      )}
      {numSelected === 0 && (
        <SearchInput
          className="mx-2 my-2 ml-auto"
          value={search}
          onChange={(val) => {
            setPage(0);
            setSearch(val);
          }}
          placeholder="?????????? ?????????? ???? ???????? ????????..."
        />
      )}

      {numSelected > 0 ? (
        selected.every((order) => order.status === "in-progress") &&
        selected.length === 1 ? (
          <div className="flex">
            <StyledTooltip title="??????????">
              <IconButton onClick={handleSendOrder}>
                <Icon icon="delivery" size={32} />
              </IconButton>
            </StyledTooltip>
            <StyledTooltip title="????????">
              <IconButton onClick={handleCancelOrder}>
                <Icon icon="remove" size={22} />
              </IconButton>
            </StyledTooltip>
            <ReactToPrint
              trigger={() => (
                <StyledTooltip title="??????????">
                  <IconButton>
                    <Icon icon="printer" size={22} />
                  </IconButton>
                </StyledTooltip>
              )}
              content={() => contentForPrintElem.current}
            />
          </div>
        ) : selected.every((order) => order.status === "in-progress") ? (
          <div className="flex">
            <StyledTooltip title="????????">
              <IconButton onClick={handleCancelOrder}>
                <Icon icon="remove" size={22} />
              </IconButton>
            </StyledTooltip>
            <ReactToPrint
              trigger={() => (
                <StyledTooltip title="??????????">
                  <IconButton>
                    <Icon icon="printer" size={22} />
                  </IconButton>
                </StyledTooltip>
              )}
              content={() => contentForPrintElem.current}
            />
          </div>
        ) : selected.every(
            (order) =>
              order.status === "in-progress" || order.status === "wait-for-pay"
          ) ? (
          <div className="flex">
            <StyledTooltip title="????????">
              <IconButton onClick={handleCancelOrder}>
                <Icon icon="remove" size={22} />
              </IconButton>
            </StyledTooltip>
            <ReactToPrint
              trigger={() => (
                <StyledTooltip title="??????????">
                  <IconButton>
                    <Icon icon="printer" size={22} />
                  </IconButton>
                </StyledTooltip>
              )}
              content={() => contentForPrintElem.current}
            />
          </div>
        ) : (
          <ReactToPrint
            trigger={() => (
              <StyledTooltip title="??????????">
                <IconButton>
                  <Icon icon="printer" size={22} />
                </IconButton>
              </StyledTooltip>
            )}
            content={() => contentForPrintElem.current}
          />
        )
      ) : (
        <>
          <FormControlLabel
            control={<Switch color="accent" />}
            label="?????? ???? ?????? ????????????"
            sx={{ "& .MuiFormControlLabel-label": { fontSize: "13px" } }}
            checked={onlyInProgress}
            onChange={(e) => setOnlyInProgress(e.target.checked)}
          />
          <div className="flex items-center text-[13px]">
            {isLoading ? (
              <PulseLoader
                size={6}
                color={theme.palette.accent.main}
                loading={true}
              />
            ) : (
              count ?? (
                <PulseLoader
                  size={6}
                  color={theme.palette.accent.main}
                  loading={true}
                />
              )
            )}
            ??????????
          </div>
        </>
      )}
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

const optionsCase = {
  "wait-for-pay": "???? ???????????? ????????????",
  "in-progress": "???? ?????? ????????????",
  shipped: "?????????? ??????",
  delivered: "?????????? ??????",
  cancelled: "?????? ??????",
};

const orderStates = {
  "wait-for-pay": waitForPayImg,
  "in-progress": inProgressImg,
  shipped: shippedImg,
  delivered: deliveredImg,
  cancelled: cancelledImg,
};

const Orders = () => {
  const dispatch = useDispatch();
  const { entity, count, status } = useSelector((state) => state.orders);
  const theme = useTheme();
  const {
    selected,
    setSelected,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    search,
    setSearch,
    onlyInProgress,
    setOnlyInProgress,
    openCancelOrderModal,
    openSendOrderModal,
    handlePageChange,
  } = useContext(orderContext);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(entity);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, clickedOrder) => {
    const selectedIndex = selected.findIndex((o) => o._id === clickedOrder._id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, clickedOrder);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (selectedOrder) =>
    selected.some((order) => order._id === selectedOrder._id);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - count) : 0;

  let debouncedSeasrchTerm = useDebounce(search, 500);

  useEffect(() => {
    dispatch(
      getOrders({
        page: page + 1,
        search,
        sortBy: orderBy,
        desc: order === "desc" ? true : false,
        itemsPerPage: rowsPerPage,
        status: onlyInProgress ? "in-progress" : undefined,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSeasrchTerm, orderBy, onlyInProgress, order]);

  const contentForPrintElem = useRef(null);

  return (
    <div className="rounded-[4px] border-[1px] border-secondary-dark-800">
      <Head>
        <title>?????????? ????</title>
      </Head>
      <OrdersToPrint ref={contentForPrintElem} orders={selected} />
      <Paper
        sx={{
          width: "100%",
          mb: "12px",
          backgroundColor: "transparent",
          backgroundImage: "none",
          boxShadow: "none",
        }}
      >
        <EnhancedTableToolbar
          theme={theme}
          numSelected={selected.length}
          selected={selected}
          search={search}
          setSearch={setSearch}
          setPage={setPage}
          isLoading={status === "loading"}
          count={count}
          setOnlyInProgress={setOnlyInProgress}
          onlyInProgress={onlyInProgress}
          handleCancelOrder={() => openCancelOrderModal(selected)}
          handleSendOrder={() => openSendOrderModal(selected[0])}
          contentForPrintElem={contentForPrintElem}
        />
        <TableContainer sx={{ minHeight: 504 }}>
          <Table aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={count}
            />
            <TableBody>
              {status === "loading" ? (
                <PulseLoader
                  size={6}
                  color={theme.palette.accent.main}
                  loading={true}
                  className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]"
                />
              ) : entity.length == 0 ? (
                <span className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] text-[14px] text-gray-400">
                  ???????????? ?????? ???????? ??????
                </span>
              ) : (
                stableSort(entity, getComparator(order, orderBy)).map(
                  (row, index) => {
                    const isItemSelected = isSelected(row);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <EnhancedTableRow
                        hover={!isItemSelected}
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id}
                        selected={isItemSelected}
                        isSelected={isItemSelected}
                      >
                        <StyledTableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                            sx={{
                              padding: "4px",
                              "&.Mui-checked": {
                                color: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "accent.main"
                                    : "accent.600",
                              },
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          <div className="flex items-center">
                            <Image
                              src={orderStates[row.status]}
                              alt="order-status"
                              width={24}
                              height={24}
                              priority
                            />
                            <span className="mr-2">
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
                  }
                )
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <StyledTableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          labelDisplayedRows={({ from, to, count }) => {
            return (
              <span>{`${from}-${to} ???? ${
                count !== -1 ? count : `?????? ???? ${to}`
              }`}</span>
            );
          }}
          labelRowsPerPage="?????????? ?????????? ???? ???? ????????"
        />
      </Paper>
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const cookies = new Cookies(ctx.req, ctx.res);
  const authorization = cookies.get("authorization");
  if (!authorization) {
    return {
      redirect: {
        destination: `/users/login?returnUrl=${ctx.resolvedUrl}&forceLogout=true`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

Orders.getLayout = function getLayout(page) {
  return (
    <MainLayout {...page.props}>
      <OrderContext>{page}</OrderContext>
    </MainLayout>
  );
};

export default Orders;
