const { createContext } = require("react");

export const customersContext = createContext({
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
  handlePageChange: () => {},
  openUserProfileModal: () => {},
  openUserOrdersModal: () => {},
});
