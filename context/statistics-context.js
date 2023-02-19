const { createContext } = require("react");

export const statisticsContext = createContext({
  recentTransactionsOrder: "",
  setRecentTransactionsOrder: () => {},
  recentTransactionsOrderBy: "",
  setRecentTransactionsOrderBy: () => {},
  recentTransactionsRowsPerPage: 0,
  setRecentTransactionsRowsPerPage: () => {},
  recentTransactionsSearch: "",
  setRecentTransactionsSearch: () => {},
  topProductsOrder: "",
  setTopProductsOrder: () => {},
  topProductsOrderBy: "",
  setTopProductsOrderBy: () => {},
  topProductsRowsPerPage: 0,
  setTopProductsRowsPerPage: () => {},
  topProductsSearch: "",
  setTopProductsSearch: () => {},
  topProductsDateRange: "",
  setTopProductsDateRange: () => {},
  openUserProfileModal: () => {},
  openUserOrdersModal: () => {},
});
