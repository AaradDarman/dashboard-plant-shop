const { createContext } = require("react");

export const inventoryContext = createContext({
  order: "",
  setOrder: () => {},
  orderBy: "",
  setOrderBy: () => {},
  page: 0,
  setPage: () => {},
  rowsPerPage: 5,
  setRowsPerPage: () => {},
  search: "",
  setSearch: () => {},
  onlyOutOfStock: false,
  setOnlyOutOfStock: () => {},
  handlePageChange: () => {},
});
