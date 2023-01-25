import { createContext } from "react";

export const productsContext = createContext({
  openFilterModal: () => {},
  closeFilterModal: () => {},
  openSortModal: () => {},
  closeSortModal: () => {},
  handleSortChange: () => {},
  handleSizeFilterChange: () => {},
  handleLightFilterChange: () => {},
  handlePageChange: () => {},
  handleSearchChange: () => {},
  handlePriceRangeFilterChange: () => {},
  filteredProductsCount: null,
  setFilteredProductsCount: () => {},
});
