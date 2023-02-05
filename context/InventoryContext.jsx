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

const InventoryContext = ({ children }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("quantity");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [search, setSearch] = useState("");
  const [onlyOutOfStock, setOnlyOutOfStock] = useState(false);

  const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
  const [isSendOrderModalOpen, setIsSendOrderModalOpen] = useState(false);
  const [targetOrders, setTargetOrders] = useState([]);
  const [targetOrder, setTargetOrder] = useState({});
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.products);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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
      }}
    >
      {children}
      {/* <CancelOrderModal
        targetOrders={targetOrders}
        isOpen={isCancelOrderModalOpen}
        onClose={closeCancelOrderModal}
        onCancelClick={handleCancelOrder}
      />
      <SendOrderModal
        targetOrder={targetOrder}
        isOpen={isSendOrderModalOpen}
        onClose={closeSendOrderModal}
        onSend={handleSendOrder}
      />
      <LoadingComponent show={status === "canceling" || status === "sending"} /> */}
    </inventoryContext.Provider>
  );
};

export default InventoryContext;
