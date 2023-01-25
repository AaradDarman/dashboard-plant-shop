import React, { useEffect, useState } from "react";

import LoadingComponent from "components/shared/LoadingComponent";
import { discountsContext } from "./discounts-context";
import SelectProductsForDiscountModal from "components/modals/SelectProductsForDiscountModal";
import { toast } from "react-toastify";
import api from "adapters/discount-adapter";
import _ from "lodash";
import gregorianCalendar from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import dayjs from "dayjs";
import discountApi from "adapters/discount-adapter";
import moment from "moment-jalaali";
import { startOfDay } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewDiscount,
  expireDiscount,
  getProductsWithoutDiscount,
  removeProduct,
} from "redux/slices/discounts";
import ExpireDiscountModal from "components/modals/ExpireDiscountModal";
import RemoveProductDiscountModal from "components/modals/RemoveProductDiscountModal";

const DiscountsContext = ({ children }) => {
  const dispatch = useDispatch();
  const [isSelectProductsModalOpen, setIsSelectProductsModalOpen] =
    useState(false);
  const [isExpireDiscountModalOpen, setIsExpireDiscountModalOpen] =
    useState(false);
  const [
    isRemoveProductDiscountModalOpen,
    setIsRemoveProductDiscountModalOpen,
  ] = useState(false);
  const [targetProductForRemove, setTargetProductForRemove] = useState("");
  const [discountForExpire, setDiscountForExpire] = useState("");

  const [discountTitle, setDiscountTitle] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [discountDateRange, setDiscountDateRange] = useState("");
  const [selectedForDiscount, setSelectedForDiscount] = useState([]);
  const { status } = useSelector((state) => state.discounts);

  useEffect(() => {
    console.log(discountDateRange);
  }, [discountDateRange]);

  const handleRemoveSelectedProduct = (item) => {
    console.log("selectedForDiscount");
    let itemsClone = [...selectedForDiscount];
    let results = _.pullAllWith(itemsClone, [item], _.isEqual);
    setSelectedForDiscount(results);
  };

  const openSelectProductsModal = () => {
    dispatch(getProductsWithoutDiscount());
    setIsSelectProductsModalOpen(true);
  };
  const closeSelectProductsModal = () => {
    setIsSelectProductsModalOpen(false);
  };

  const openExpireDiscountModal = (discount) => {
    setDiscountForExpire(discount);
    setIsExpireDiscountModalOpen(true);
  };
  const closeExpireDiscountModal = () => {
    setIsExpireDiscountModalOpen(false);
  };

  const openRemoveProductDiscountModal = (product) => {
    setTargetProductForRemove(product);
    setIsRemoveProductDiscountModalOpen(true);
  };
  const closeRemoveProductDiscountModal = () => {
    setIsRemoveProductDiscountModalOpen(false);
  };

  const handleSelectProductForDiscount = ({ selected }) => {
    setSelectedForDiscount(selected);
    closeSelectProductsModal();
  };

  const handleExpireDiscount = () => {
    dispatch(expireDiscount(discountForExpire._id));
    closeExpireDiscountModal();
  };

  const handleRemoveProductFromDiscountList = () => {
    dispatch(
      removeProduct({
        discountId: targetProductForRemove.discountId,
        product: targetProductForRemove,
      })
    );
    closeRemoveProductDiscountModal();
  };

  const clearData = () => {
    setDiscountTitle("");
    setDiscountPercentage("");
    setDiscountDateRange("");
    setSelectedForDiscount([]);
  };

  const handleSaveDiscount = () => {
    const grouped = _.groupBy(selectedForDiscount, "name");
    let objectKeys = Object.keys(grouped);

    let productsWithDiscount = objectKeys.map((key) => {
      return {
        title: discountTitle,
        name: key,
        includes: grouped[key].map((obj) => {
          return { size: obj.size, discount: +discountPercentage };
        }),
      };
    });

    dispatch(
      addNewDiscount({
        title: discountTitle,
        startDate: dayjs(
          discountDateRange[0].convert(gregorianCalendar, gregorian_en).format()
        ),
        endDate: dayjs(
          discountDateRange[1].convert(gregorianCalendar, gregorian_en).format()
        ).endOf("day"),
        productsWithDiscount,
      })
    )
      .unwrap()
      .then(() => {
        clearData();
      });
  };

  return (
    <discountsContext.Provider
      value={{
        openSelectProductsModal,
        selectedForDiscount,
        setSelectedForDiscount,
        handleRemoveSelectedProduct,
        discountTitle,
        setDiscountTitle,
        discountPercentage,
        setDiscountPercentage,
        discountDateRange,
        setDiscountDateRange,
        handleSaveDiscount,
        openExpireDiscountModal,
        openRemoveProductDiscountModal,
      }}
    >
      {children}
      <SelectProductsForDiscountModal
        isOpen={isSelectProductsModalOpen}
        onClose={closeSelectProductsModal}
        onSelectProducts={handleSelectProductForDiscount}
      />
      <ExpireDiscountModal
        isOpen={isExpireDiscountModalOpen}
        onClose={closeExpireDiscountModal}
        onExpireClick={handleExpireDiscount}
        targetDiscountTitle={discountForExpire.title}
      />
      <RemoveProductDiscountModal
        isOpen={isRemoveProductDiscountModalOpen}
        onClose={closeRemoveProductDiscountModal}
        onRemove={handleRemoveProductFromDiscountList}
        targetProductForRemove={`${targetProductForRemove.name} ${targetProductForRemove.size}`}
      />
      <LoadingComponent show={status === "creating" || status === "removing"} />
    </discountsContext.Provider>
  );
};

export default DiscountsContext;
