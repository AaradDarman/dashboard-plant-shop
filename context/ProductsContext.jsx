import React, { useState } from "react";

import { useRouter } from "next/router";

import FilterProductsModal from "components/modals/FilterProductsModal";
import SortProductsModal from "components/modals/SortProductsModal";
import { productsContext } from "./products-context";

const ProductsContext = ({ children }) => {
  const router = useRouter();
  const { size, light } = router.query;

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const [filteredProductsCount, setFilteredProductsCount] = useState(null);

  const [selectedSize, setSelectedSize] = useState(
    size ? (Array.isArray(size) ? [...size] : [size]) : []
  );
  const [selectedLight, setSelectedLight] = useState(
    light ? (Array.isArray(light) ? [...light] : [light]) : []
  );

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };
  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const openSortModal = () => {
    setIsSortModalOpen(true);
  };
  const closeSortModal = () => {
    setIsSortModalOpen(false);
  };

  const handleSortChange = (sortBy) => {
    let prevQuery = router.query;
    router.replace({
      // pathname: router.pathname,
      query: { ...prevQuery, sortBy },
    });
  };

  const handleSearchChange = (search) => {
    let prevQuery = router.query;
    if (search) {
      router.replace({
        query: { ...prevQuery, search },
      });
    } else {
      router.replace({
        query: { ...prevQuery, search: [] },
      });
    }
  };

  const handleSizeFilterChange = (value) => {
    let prevQuery = router.query;
    let updatedSizeFilters;
    const selectedSizeClone = [...selectedSize];

    const target = selectedSize.find((item) => item === value);

    if (target) {
      const updatedSelectedSize = selectedSize.filter((item) => item !== value);
      setSelectedSize(updatedSelectedSize);
      updatedSizeFilters = updatedSelectedSize;
    } else {
      selectedSizeClone.push(value);
      setSelectedSize(selectedSizeClone);
      updatedSizeFilters = selectedSizeClone;
    }
    router.replace({
      query: {
        ...prevQuery,
        size: updatedSizeFilters,
      },
    });
  };

  const handleLightFilterChange = (value) => {
    let prevQuery = router.query;
    let updatedLightFilters;
    const selectedLightClone = [...selectedLight];

    const target = selectedLight.find((item) => item === value);

    if (target) {
      const updatedSelectedLight = selectedLight.filter(
        (item) => item !== value
      );
      setSelectedLight(updatedSelectedLight);
      updatedLightFilters = updatedSelectedLight;
    } else {
      selectedLightClone.push(value);
      setSelectedLight(selectedLightClone);
      updatedLightFilters = selectedLightClone;
    }
    router.replace({
      query: {
        ...prevQuery,
        light: updatedLightFilters,
      },
    });
  };

  const handlePriceRangeFilterChange = (value) => {
    let prevQuery = router.query;
    router.replace({
      query: {
        ...prevQuery,
        minPrice: value[0],
        maxPrice: value[1],
      },
    });
  };

  const handlePageChange = (page) => {
    let prevQuery = router.query;
    router.replace({
      // pathname: router.pathname,
      query: {
        ...prevQuery,
        page,
      },
    });
  };

  return (
    <productsContext.Provider
      value={{
        openFilterModal,
        closeFilterModal,
        openSortModal,
        closeSortModal,
        handleSortChange,
        handleSearchChange,
        handleSizeFilterChange,
        handleLightFilterChange,
        handlePageChange,
        handlePriceRangeFilterChange,
        filteredProductsCount,
        setFilteredProductsCount,
      }}
    >
      {children}
      <FilterProductsModal
        open={isFilterModalOpen}
        onClose={closeFilterModal}
      />
      <SortProductsModal
        isOpen={isSortModalOpen}
        onClose={closeSortModal}
        onChange={handleSortChange}
      />
    </productsContext.Provider>
  );
};

export default ProductsContext;
