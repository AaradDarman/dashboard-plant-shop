import React, { useEffect, useState } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { customersContext } from "./customers-context";
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
import UserProfileModal from "components/modals/UserProfileModal";
import UserOrdersModal from "components/modals/UserOrdersModal";

const CustomersContext = ({ children }) => {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("ordersCount");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(11);
  const [search, setSearch] = useState("");

  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isUserOrdersModalOpen, setIsUserOrdersModalOpen] = useState(false);
  const [targetCustomer, setTargetCustomer] = useState({});
  const dispatch = useDispatch();

  const openUserProfileModal = (item) => {
    setTargetCustomer(item);
    setIsUserProfileModalOpen(true);
  };
  const closeUserProfileModal = () => {
    setIsUserProfileModalOpen(false);
  };

  const openUserOrdersModal = (item) => {
    setTargetCustomer(item);
    setIsUserOrdersModalOpen(true);
  };
  const closeUserOrdersModal = () => {
    setIsUserOrdersModalOpen(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <customersContext.Provider
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
        handlePageChange,
        openUserProfileModal,
        openUserOrdersModal,
      }}
    >
      {children}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={closeUserProfileModal}
        targetCustomer={targetCustomer}
      />
      <UserOrdersModal
        isOpen={isUserOrdersModalOpen}
        onClose={closeUserOrdersModal}
        targetCustomer={targetCustomer}
      />
      {/* <LoadingComponent show={status === "updating" || status === "charging"} /> */}
    </customersContext.Provider>
  );
};

export default CustomersContext;
