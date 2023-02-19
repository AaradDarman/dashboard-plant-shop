import { Button, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import {
  addHoursToDate,
  getPersianDateWithMonthInLetters,
} from "utils/date-helper";
import { numberWithCommas } from "utils/number-helper";
import DotDevider from "components/shared/DotDevider";
import { calculateDiscountedTotalPrice } from "utils/product-helper";
import inProgressImg from "public/images/order-process.png";
import waitForPayImg from "public/images/order-wait-for-pay.png";
import deliveredImg from "public/images/order-delivered.png";
import shippedImg from "public/images/order-shipped.png";
import cancelledImg from "public/images/order-cancelled.png";
import CustomerOrderItem from "./CustomerOrderItem";

const optionsCase = {
  "wait-for-pay": "در انتظار پرداخت",
  "in-progress": "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

const orderStates = {
  "wait-for-pay": waitForPayImg,
  "in-progress": inProgressImg,
  shipped: shippedImg,
  delivered: deliveredImg,
  cancelled: cancelledImg,
};

const CustomerOrder = ({ order }) => {
  const [discountedTotalPrice, setDiscountedTotalPrice] = useState();
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    let discountedTotalPrice = calculateDiscountedTotalPrice(order.items);
    let totalP = order.items.reduce(
      (total, obj) => total + obj.price * obj.quantity,
      0
    );
    setTotalPrice(totalP);
    setDiscountedTotalPrice(discountedTotalPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col rounded-[4px] border-[1px] border-solid border-secondary-dark-200 p-[1rem] dark:border-secondary-dark-800">
      <Link passHref href={`/orders/${order.orderNumber}`}>
        <a className="hover:text-inherit">
          <div className="order-status flex items-center py-2">
            <Image
              src={orderStates[order.status]}
              alt="order-status"
              width={32}
              height={32}
              priority
            />
            <span className="mr-2">{optionsCase[order.status]}</span>
            <FontAwesomeIcon
              icon={faChevronLeft}
              width={24}
              className="mr-auto"
            />
          </div>
          <div className="hidden py-2 lg:flex">
            <Typography variant="body1" className="order-date">
              {getPersianDateWithMonthInLetters(order.createAt)}
            </Typography>
            <DotDevider />
            <Typography variant="body1" className="font-mono">
              <span className="ml-[8px] font-Byekan text-gray-400">
                شماره سفارش
              </span>
              {order.orderNumber}
            </Typography>
            <DotDevider />
            <Typography variant="body1" className="order-total-price">
              <span className="ml-[8px] text-gray-400">مبلغ</span>
              {`${numberWithCommas(discountedTotalPrice)} تومان`}
            </Typography>
          </div>
          <div className="flex py-2 lg:hidden">
            <Typography variant="body1" className="font-mono">
              <span className="ml-[8px] font-Byekan text-gray-400">
                شماره سفارش
              </span>
              {order.orderNumber}
            </Typography>
          </div>
          <div className="flex flex-wrap items-center justify-between py-2 lg:hidden">
            <Typography variant="body1" className="order-date">
              {getPersianDateWithMonthInLetters(order.createAt)}
            </Typography>
            <Typography variant="body1" className="order-total-price">
              <span className="ml-[8px] text-gray-400">مبلغ</span>
              {`${numberWithCommas(totalPrice)} تومان`}
            </Typography>
          </div>
          <div className="bpord flex flex-wrap items-center border-t-[1px] border-solid border-t-secondary-dark-200 dark:border-t-secondary-dark-800">
            {order?.items.map((item) => (
              <CustomerOrderItem key={item._id} item={item} />
            ))}
          </div>
        </a>
      </Link>
    </div>
  );
};

export default CustomerOrder;
