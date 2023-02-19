import React, { useContext, useEffect, useState } from "react";

import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
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
import { useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import { inventoryContext } from "context/inventory-context";
import { visuallyHidden } from "@mui/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import EnhancedTableHead from "components/shared/EnhancedTableHead";
import SearchInput from "components/shared/SearchInput";

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
    id: "name",
    disablePadding: true,
    label: "نام",
  },
  {
    id: "size",
    numeric: true,
    disablePadding: false,
    label: "سایز",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "موجودی",
  },
  {
    id: "empty",
    disablePadding: false,
    label: "",
  },
];


const StyledInputWraper = styled.form`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.palette.accent.main};
  background-color: ${({ theme }) => theme.palette.secondary.main};
  padding: 10px 4px;
`;

const StyledInput = styled.input`
  all: unset;
  padding: 2px 4px;
  color: ${({ theme }) => theme.palette.text.primary};
  ::placeholder {
    font-size: 14px;
  }
`;

function EnhancedTableToolbar(props) {
  const {
    search,
    setSearch,
    setPage,
    isLoading,
    count,
    setOnlyOutOfStock,
    onlyOutOfStock,
    theme,
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
      className="!min-h-fit"
    >
      <SearchInput
        className="mx-2 my-2 ml-auto"
        value={search}
        onChange={(val) => {
          setPage(0);
          setSearch(val);
        }}
        placeholder='نام محصول را وارد کنید ...'
      />
      <>
        <FormControlLabel
          control={<Switch color="accent" />}
          label="فقط ناموجود ها"
          sx={{ "& .MuiFormControlLabel-label": { fontSize: "13px" } }}
          checked={onlyOutOfStock}
          onChange={(e) => setOnlyOutOfStock(e.target.checked)}
        />
        <div className="flex items-center text-[13px]">
          <span className="ml-1">
            {count ?? (
              <PulseLoader
                size={6}
                color={theme.palette.accent.main}
                loading={true}
              />
            )}
          </span>
          آیتم
        </div>
      </>
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

const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    borderColor: "rgba(255, 255, 255, 0.23)",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderColor: "rgba(255, 255, 255, 0.23)",
    padding: "6px 0",
    [theme.breakpoints.up("md")]: {
      padding: "6px 16px",
    },
  },
}));

const ToBeStyledTooltip = ({ className, ...props }) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
);
const StyledTooltip = muiStyled(ToBeStyledTooltip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const InventoryList = ({ onRemoveItem }) => {
  const theme = useTheme();
  const { inventory, inventoryCount, status } = useSelector(
    (state) => state.products
  );
  const {
    order,
    setOrder,
    orderBy,
    setOrderBy,
    search,
    setSearch,
    page,
    setPage,
    rowsPerPage,
    handlePageChange,
    setOnlyOutOfStock,
    onlyOutOfStock,
    openOutOfStockModal,
    openChargeQuantityModal,
  } = useContext(inventoryContext);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event, title) => {
    setAnchorEl({ [title]: event.currentTarget });
    // setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <EnhancedTableToolbar
        theme={theme}
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        isLoading={status === "loading"}
        count={inventoryCount}
        setOnlyOutOfStock={setOnlyOutOfStock}
        onlyOutOfStock={onlyOutOfStock}
        handleCancelOrder={() => console.log("object")}
        handleSendOrder={() => console.log("object")}
      />
      <TableContainer
        sx={{
          width: "100%",
          height: "100%",
          mb: "12px",
          backgroundColor: "transparent",
          backgroundImage: "none",
          boxShadow: "none",
          minHeight: 521,
        }}
        component={Paper}
      >
        <Table size="small" stickyHeader>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={headCells}
          />
          <TableBody>
            {status === "loading" ? (
              <PulseLoader
                size={6}
                color={theme.palette.accent.main}
                loading={true}
                className="absolute top-[50%] left-[50%] z-10 -translate-y-[50%] -translate-x-[50%]"
              />
            ) : inventory.length == 0 ? (
              <span className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] text-[14px] text-gray-400">
                آیتمی یافت نشد
              </span>
            ) : (
              stableSort(inventory, getComparator(order, orderBy)).map(
                (item, index) => {
                  const itemId = `${item.name}-${item.size}`;
                  return (
                    <EnhancedTableRow
                      hover
                      tabIndex={-1}
                      key={`${item}-${index}`}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <StyledTableCell align="center">
                        {item.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.size}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <span
                          className={`rounded-md px-2 ${
                            item.quantity >= 10 &&
                            "bg-[#a47d06]/[.2] text-[#a47d06]"
                          } ${
                            item.quantity < 10 &&
                            "bg-[#db3131]/[.2] text-[#db3131]"
                          } ${
                            item.quantity > 20 &&
                            "bg-[#16a34a]/[.2] text-[#16a34a]"
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{
                          padding: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src={item.images[0]}
                          alt="product-pic"
                          width={45}
                          height={45}
                        />
                        <IconButton
                          id={`iconbtn-${itemId}`}
                          aria-controls={
                            Boolean(anchorEl && anchorEl[itemId])
                              ? `menuItem-${itemId}`
                              : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={
                            Boolean(anchorEl && anchorEl[itemId])
                              ? "true"
                              : undefined
                          }
                          onClick={(e) => handleClick(e, itemId)}
                          className="!text-[19px]"
                        >
                          <FontAwesomeIcon
                            icon={faEllipsisVertical}
                            width={19}
                          />
                        </IconButton>
                        <Menu
                          id={`menuItem-${itemId}`}
                          MenuListProps={{
                            "aria-labelledby": `iconbtn-${itemId}`,
                          }}
                          anchorEl={anchorEl && anchorEl[itemId]}
                          open={Boolean(anchorEl && anchorEl[itemId])}
                          keepMounted
                          onClose={handleClose}
                          elevation={0}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          sx={{
                            "& .MuiPaper-root": {
                              backgroundColor: theme.palette.primary[800],
                            },
                            "& .MuiMenuItem-root": {
                              "&:active": {
                                backgroundColor: alpha(
                                  theme.palette.secondary.main,
                                  theme.palette.action.selectedOpacity
                                ),
                              },
                            },
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              openChargeQuantityModal(item);
                              handleClose();
                            }}
                          >
                            <Icon icon="add" size={19} className="ml-[8px]" />
                            افزایش موجودی
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              openOutOfStockModal(item);
                              handleClose();
                            }}
                          >
                            <Icon
                              icon="out-of-stock"
                              size={19}
                              className="ml-[8px]"
                            />
                            اتمام موجودی
                          </MenuItem>
                          <MenuItem onClick={handleClose}>
                            <Link href={`products/edit/${item.productId}`}>
                              <a>
                                <Icon
                                  icon="edit"
                                  size={19}
                                  className="ml-[8px]"
                                />
                                <span>ویرایش محصول</span>
                              </a>
                            </Link>
                          </MenuItem>
                        </Menu>
                      </StyledTableCell>
                    </EnhancedTableRow>
                  );
                }
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={inventoryCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        labelDisplayedRows={({ from, to, count }) => {
          return (
            <span>{`${from}-${to} از ${
              count !== -1 ? count : `بیش از ${to}`
            }`}</span>
          );
        }}
        labelRowsPerPage="تعداد رکورد در هر صفحه"
      />
    </>
  );
};

export default InventoryList;
