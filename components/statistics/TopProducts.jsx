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
import { getPersianDate } from "utils/date-helper";
import { numberWithCommas } from "utils/number-helper";
import SearchInput from "components/shared/SearchInput";
import { getTopProducts } from "redux/slices/statistics";
import useInfiniteScroll from "components/hooks/useInfiniteScroll";
import { statisticsContext } from "context/statistics-context";
import { useDebounce } from "components/hooks/useDebounce";
import useBreakpoints from "utils/useBreakPoints";

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
    id: "productName",
    disablePadding: false,
    label: "نام محصول",
    align: "left",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "قیمت",
  },
  {
    id: "soldCount",
    numeric: true,
    disablePadding: false,
    label: "تعداد فروش",
  },
  {
    id: "totalSale",
    disablePadding: false,
    label: "فروش کل",
  },
];

function EnhancedTableToolbar(props) {
  const {
    search,
    setSearch,
    theme,
    topProductsDateRange,
    setTopProductsDateRange,
  } = props;

  return (
    <Toolbar
      sx={{
        padding: "0 8px !important",
      }}
      className="flex !min-h-fit flex-wrap"
    >
      <Typography variant="h6" className="!my-2 !text-[16px]">
        محصولات برتر
      </Typography>
      <FormControl
        sx={{ minWidth: 64 }}
        variant="standard"
        className="!mr-auto"
      >
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={topProductsDateRange}
          label=""
          onChange={(event) => setTopProductsDateRange(event.target.value)}
          className="min-h-[34px] rounded-md border-[1px] border-secondary-dark-800 pr-[0.7rem] pl-5"
          IconComponent={(props) => (
            <FontAwesomeIcon icon={faChevronDown} width={10} {...props} />
          )}
          sx={{
            fontSize: "14px !important",
            "&:hover:before": {
              border: "none !important",
            },
            "& .MuiInput-input": {
              paddingRight: "0 !important",
            },
            "& .MuiInput-input:focus": {
              backgroundColor: "unset",
            },
            "&:before": {
              display: "none",
              borderBottom: "none",
            },
            "&:after": {
              display: "none",
            },
            "& .MuiSelect-icon": {
              right: "6px",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "secondary.main",
                "& .MuiMenu-list": {
                  padding: 0,
                  fontSize: "14px !important",
                },
                "& .MuiMenuItem-root": {
                  fontSize: "14px !important",
                },
                "& .MuiMenuItem-root:hover": {
                  bgcolor: "primary.main",
                },
                "& .MuiMenuItem-root.Mui-selected": {
                  bgcolor: alpha(
                    theme.palette.accent.main,
                    theme.palette.action.activatedOpacity
                  ),
                },
                "& .MuiMenuItem-root.Mui-selected:hover": {
                  bgcolor: alpha(
                    theme.palette.accent.main,
                    theme.palette.action.activatedOpacity
                  ),
                },
              },
            },
          }}
        >
          <MenuItem value="this week">هفته جاری</MenuItem>
          <MenuItem value="this month">ماه جاری</MenuItem>
          <MenuItem value="this year">امسال</MenuItem>
        </Select>
      </FormControl>
      <SearchInput
        className="my-2 mr-2 !rounded-md border-[1px] border-secondary-dark-800 !bg-transparent"
        value={search}
        onChange={(val) => {
          setSearch(val);
        }}
        placeholder="نام محصول را وارد کنید..."
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

const TopProducts = ({ className }) => {
  const theme = useTheme();
  const { entity, status, totalCount } = useSelector(
    (state) => state.statistics.topProducts
  );
  const {
    topProductsOrder,
    setTopProductsOrder,
    topProductsOrderBy,
    setTopProductsOrderBy,
    topProductsSearch,
    setTopProductsSearch,
    topProductsRowsPerPage,
    topProductsDateRange,
    setTopProductsDateRange,
    openUserProfileModal,
    openUserOrdersModal,
  } = useContext(statisticsContext);

  const parentRef = useRef(null);
  const dispatch = useDispatch();
  const { isXs } = useBreakpoints();

  const handleRequestSort = (event, property) => {
    const isAsc = topProductsOrderBy === property && topProductsOrder === "asc";
    setTopProductsOrder(isAsc ? "desc" : "asc");
    setTopProductsOrderBy(property);
  };

  const handleScrollEnd = () => {
    dispatch(
      getTopProducts({
        search: debouncedSeasrchTerm,
        sortBy: topProductsOrderBy,
        desc: topProductsOrder === "desc" ? true : false,
        range: topProductsDateRange,
        itemsPerPage: topProductsRowsPerPage,
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
  let debouncedSeasrchTerm = useDebounce(topProductsSearch, 500);

  useEffect(() => {
    dispatch(
      getTopProducts({
        search: debouncedSeasrchTerm,
        sortBy: topProductsOrderBy,
        desc: topProductsOrder === "desc" ? true : false,
        range: topProductsDateRange,
        itemsPerPage: topProductsRowsPerPage,
        skip: entity.length,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSeasrchTerm,
    topProductsOrderBy,
    topProductsOrder,
    topProductsDateRange,
  ]);

  return (
    <div
      className={`${className} relative flex flex-col rounded-[4px] border-[1px] border-secondary-dark-800`}
    >
      <EnhancedTableToolbar
        theme={theme}
        search={topProductsSearch}
        setSearch={setTopProductsSearch}
        topProductsDateRange={topProductsDateRange}
        setTopProductsDateRange={setTopProductsDateRange}
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
          direction: isXs ? "ltr" : "rtl",
        }}
        ref={parentRef}
      >
        <Table size="small" stickyHeader sx={{ "&": { direction: "ltr" } }}>
          <EnhancedTableHead
            order={topProductsOrder}
            orderBy={topProductsOrderBy}
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
            ) : entity.length == 0 ? (
              <span className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] text-[14px] text-gray-400">
                محصولی در لیست فروش نمی باشد
              </span>
            ) : (
              stableSort(
                entity,
                getComparator(topProductsOrder, topProductsOrderBy)
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
                    <StyledTableCell
                      align="center"
                      className="!flex !items-center"
                    >
                      <Image
                        src={item.images[0]}
                        alt="product-pic"
                        width={35}
                        height={35}
                      />
                      {item.name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {numberWithCommas(item.price)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.soldCount}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {numberWithCommas(item.totalSale)}
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

export default TopProducts;
