import React, { useEffect, useState } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { orderContext } from "./order-context";
import userApi from "adapters/user-adapter";
import LoadingComponent from "components/shared/LoadingComponent";
import CancelOrderModal from "components/modals/CancelOrderModal";
import { cancelOrders, getOrders, sendOrders } from "redux/slices/orders";
import SendOrderModal from "components/modals/SendOrderModal";

const OrderContext = ({ children }) => {
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createAt");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [onlyInProgress, setOnlyInProgress] = useState(false);

  const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
  const [isSendOrderModalOpen, setIsSendOrderModalOpen] = useState(false);
  const [targetOrders, setTargetOrders] = useState([]);
  const [targetOrder, setTargetOrder] = useState({});
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.orders);

  const openCancelOrderModal = (orders) => {
    setTargetOrders(orders);
    setIsCancelOrderModalOpen(true);
  };
  const closeCancelOrderModal = () => {
    setIsCancelOrderModalOpen(false);
  };

  const openSendOrderModal = (order) => {
    setTargetOrder(order);
    setIsSendOrderModalOpen(true);
  };
  const closeSendOrderModal = () => {
    setIsSendOrderModalOpen(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleCancelOrder = () => {
    dispatch(cancelOrders(targetOrders.map((order) => order._id)))
      .unwrap()
      .then((originalPromiseResult) => {
        setSelected([]);
        closeCancelOrderModal();
      });
  };

  const handleSendOrder = ({ postTrackingNumber }) => {
    dispatch(sendOrders({ orderId: targetOrder._id, postTrackingNumber }))
      .unwrap()
      .then((originalPromiseResult) => {
        setSelected([]);
        closeSendOrderModal();
      });
  };

  return (
    <orderContext.Provider
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
        selected,
        setSelected,
        onlyInProgress,
        setOnlyInProgress,
        openCancelOrderModal,
        openSendOrderModal,
        handlePageChange,
      }}
    >
      {children}
      <CancelOrderModal
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
      <LoadingComponent show={status === "canceling" || status === "sending"} />
    </orderContext.Provider>
  );
};

export default OrderContext;
