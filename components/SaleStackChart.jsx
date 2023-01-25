import React from "react";

import styled from "styled-components";
import { useTheme } from "@mui/material";
import Icon from "./shared/Icon";
import { useSelector } from "react-redux";

const optionsCase = {
  "wait-for-pay": "در انتظار پرداخت",
  "in-progress": "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

const statusColor = {
  "wait-for-pay": "#2e2e2e",
  "in-progress": "#a47d06",
  shipped: "#0ea5e9",
  delivered: "#16a34a",
  cancelled: "#db3131",
};

const StlyedDataBox = styled.div`
  display: flex;
  span:first-child {
    margin-left: 2rem;
    min-width: 40px;
    text-align: left;
  }
  span:last-child {
    margin-right: 1rem;
  }
  span:nth-child(3) {
    margin-right: auto;
  }
`;

const BarGraph = ({ allOrdersCount, totalCount }) => {
  return (
    <div className="justify- flex w-[20px] flex-col-reverse items-center overflow-hidden rounded-full">
      {allOrdersCount.map((obj) => {
        let basisPercentage = Math.round((100 * obj.count) / totalCount);
        return (
          <div
            key={obj.status}
            className={`w-full`}
            style={{
              flexBasis: `${basisPercentage}%`,
              backgroundColor: statusColor[obj.status],
            }}
          ></div>
        );
      })}
      {/* <div className="w-full basis-[13%] bg-yellow-600"></div>
      <div className="w-full basis-[77%] bg-blue-600"></div> */}
    </div>
  );
};

const SaleStackChart = () => {
  const theme = useTheme();
  const { financialStatistics } = useSelector((state) => state.analytics);
  const { ordersCount } = financialStatistics;
  return (
    <div className="my-10 flex">
      <div className="flex flex-1 flex-col items-stretch">
        <StlyedDataBox className="py-2 px-2 md:px-8">
          <span className="text-gray-400">
            {`${
              Math.round((100 * ordersCount.shipped) / ordersCount.total) || 0
            }%`}
          </span>
          <span>{ordersCount.shipped}</span>
          <span>ارسال شده</span>
          <Icon
            className="mr-2 rounded-md bg-[#0ea5e9] p-[1px]"
            icon="shipped"
            size={30}
          />
        </StlyedDataBox>
        <StlyedDataBox className="py-2 px-2 md:px-8">
          <span className="text-gray-400">
            {`${
              Math.round((100 * ordersCount.delivered) / ordersCount.total) || 0
            }%`}
          </span>
          <span>{ordersCount.delivered}</span>
          <span>تحویل شده</span>
          <Icon
            className="mr-2 rounded-md bg-[#16a34a] p-[1px]"
            icon="delivered-box"
            size={30}
          />
        </StlyedDataBox>
        <StlyedDataBox className="py-2 px-2 md:px-8">
          <span className="text-gray-400">
            {`${
              Math.round((100 * ordersCount.inProgress) / ordersCount.total) ||
              0
            }%`}
          </span>
          <span>{ordersCount.inProgress}</span>
          <span>در حال پردازش</span>
          <Icon
            className="mr-2 rounded-md bg-[#a47d06] p-[1px]"
            icon="processing"
            size={30}
          />
        </StlyedDataBox>
        <StlyedDataBox className="py-2 px-2 md:px-8">
          <span className="text-gray-400">
            {`${
              Math.round((100 * ordersCount.waitForPay) / ordersCount.total) ||
              0
            }%`}
          </span>
          <span>{ordersCount.waitForPay}</span>
          <span>در انتظار پرداخت</span>
          <Icon
            className="mr-2 rounded-md bg-[#2e2e2e] p-[1px]"
            icon="pay-per-click"
            size={30}
          />
        </StlyedDataBox>
        <StlyedDataBox className="py-2 px-2 md:px-8">
          <span className="text-gray-400">
            {`${
              Math.round((100 * ordersCount.cancelled) / ordersCount.total) || 0
            }%`}
          </span>
          <span>{ordersCount.cancelled}</span>
          <span>کنسل شده</span>
          <Icon
            className="mr-2 rounded-md bg-[#db3131] p-[1px]"
            icon="cancel-squar"
            size={30}
          />
        </StlyedDataBox>
      </div>
      <div className="flex">
        <BarGraph
          allOrdersCount={[
            {
              status: "shipped",
              count: ordersCount.shipped,
            },
            {
              status: "delivered",
              count: ordersCount.delivered,
            },
            {
              status: "in-progress",
              count: ordersCount.inProgress,
            },
            {
              status: "wait-for-pay",
              count: ordersCount.waitForPay,
            },
            {
              status: "cancelled",
              count: ordersCount.cancelled,
            },
          ]}
          totalCount={ordersCount.total}
        />
      </div>
    </div>
  );
};

export default SaleStackChart;
