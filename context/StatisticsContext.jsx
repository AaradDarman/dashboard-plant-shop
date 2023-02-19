import React, { useEffect, useState } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { statisticsContext } from "./statistics-context";

import UserProfileModal from "components/modals/UserProfileModal";
import UserOrdersModal from "components/modals/UserOrdersModal";

const StatisticsContext = ({ children }) => {
  const { entity, status, totalCount } = useSelector(
    (state) => state.statistics.topProducts
  );
  const [recentTransactionsOrder, setRecentTransactionsOrder] =
    useState("desc");
  const [recentTransactionsOrderBy, setRecentTransactionsOrderBy] =
    useState("paidAt");
  const [recentTransactionsRowsPerPage, setRecentTransactionsRowsPerPage] =
    useState(9);
  const [recentTransactionsSearch, setRecentTransactionsSearch] = useState("");

  const [topProductsOrder, setTopProductsOrder] = useState("desc");
  const [topProductsOrderBy, setTopProductsOrderBy] = useState("soldCount");
  const [topProductsRowsPerPage, setTopProductsRowsPerPage] = useState(9);
  const [topProductsSearch, setTopProductsSearch] = useState("");
  const [topProductsDateRange, setTopProductsDateRange] = useState("this year");
  const [topProductsSkip, setTopProductsSkip] = useState(entity.length);

  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isUserOrdersModalOpen, setIsUserOrdersModalOpen] = useState(false);
  const [targetCustomer, setTargetCustomer] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(topProductsSkip);
  }, [topProductsSkip]);

  useEffect(() => {
    // setTopProductsSkip(entity.length);
  }, [entity.length]);

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

  return (
    <statisticsContext.Provider
      value={{
        recentTransactionsOrder,
        setRecentTransactionsOrder,
        recentTransactionsOrderBy,
        setRecentTransactionsOrderBy,
        recentTransactionsRowsPerPage,
        setRecentTransactionsRowsPerPage,
        recentTransactionsSearch,
        setRecentTransactionsSearch,
        topProductsOrder,
        setTopProductsOrder,
        topProductsOrderBy,
        setTopProductsOrderBy,
        topProductsRowsPerPage,
        setTopProductsRowsPerPage,
        topProductsSearch,
        setTopProductsSearch,
        topProductsDateRange,
        setTopProductsDateRange,
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
    </statisticsContext.Provider>
  );
};

export default StatisticsContext;
