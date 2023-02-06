import React, { useEffect, useState } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { inventoryContext } from "./inventory-context";
import userApi from "adapters/user-adapter";
import LoadingComponent from "components/shared/LoadingComponent";
import CancelOrderModal from "components/modals/CancelOrderModal";
import { cancelOrders, getOrders, sendOrders } from "redux/slices/orders";
import SendOrderModal from "components/modals/SendOrderModal";
import OutOfStockProductModal from "components/modals/OutOfStockProductModal";
import ChargeProductQuantityModal from "components/modals/ChargeProductQuantityModal";
import {
  ChargeProductQuantity,
  OutOfStockProduct,
} from "redux/slices/products";

const InventoryContext = ({ children }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("quantity");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [search, setSearch] = useState("");
  const [onlyOutOfStock, setOnlyOutOfStock] = useState(false);

  const [isOutOfStockModalOpen, setIsOutOfStockModalOpen] = useState(false);
  const [isChargeQuantityOpen, setIsChargeQuantityOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState({});
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.products);

  const openOutOfStockModal = (product) => {
    setTargetProduct(product);
    setIsOutOfStockModalOpen(true);
  };
  const closeOutOfStockModal = () => {
    setIsOutOfStockModalOpen(false);
  };

  const openChargeQuantityModal = (product) => {
    setTargetProduct(product);
    setIsChargeQuantityOpen(true);
  };
  const closeChargeQuantityModal = () => {
    setIsChargeQuantityOpen(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleOutOfStock = () => {
    dispatch(OutOfStockProduct(targetProduct));
    closeOutOfStockModal();
  };

  const handleChargeQuantity = ({ quantity }) => {
    dispatch(
      ChargeProductQuantity({ addedQuantity: quantity, product: targetProduct })
    );
    closeChargeQuantityModal();
  };

  return (
    <inventoryContext.Provider
      value={{
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
        onlyOutOfStock,
        setOnlyOutOfStock,
        handlePageChange,
        openOutOfStockModal,
        openChargeQuantityModal,
      }}
    >
      {children}
      <OutOfStockProductModal
        targetProduct={targetProduct}
        isOpen={isOutOfStockModalOpen}
        onClose={closeOutOfStockModal}
        onSave={handleOutOfStock}
      />
      <ChargeProductQuantityModal
        targetProduct={targetProduct}
        isOpen={isChargeQuantityOpen}
        onClose={closeChargeQuantityModal}
        onSave={handleChargeQuantity}
      />
      <LoadingComponent show={status === "updating" || status === "charging"} />
    </inventoryContext.Provider>
  );
};

export default InventoryContext;
