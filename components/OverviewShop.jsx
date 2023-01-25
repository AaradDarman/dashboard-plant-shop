import React, { useEffect, useState } from "react";

import { Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import SaleStackChart from "./SaleStackChart";
import RevenueChart from "./RevenueChart";
import { useDispatch, useSelector } from "react-redux";
import { getFinancialStatistics, getIncome } from "redux/slices/analytics";
import { numberWithCommas } from "utils/number-helper";
import { rgba } from "polished";
import Icon from "./shared/Icon";
import { PulseLoader } from "react-spinners";

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  padding: 20px;
  min-height: 180px;
  justify-content: space-between;
  background-color: ${({ growth }) =>
    growth > 0
      ? rgba("#16a34a", 0.2)
      : growth === 0
      ? rgba("#0ea5e9", 0.2)
      : rgba("#db3131", 0.2)};
  .growth {
    color: ${({ growth }) =>
      growth > 0 ? "#16a34a" : growth === 0 ? "#0ea5e9" : "#db3131"};
    direction: ltr;
    text-align: right;
  }
`;

const OverviewShop = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { financialStatistics } = useSelector((state) => state.analytics);
  const { newOrders, averageSales, totalIncome, status } = financialStatistics;
  const [incomeRange, setIncomeRange] = useState("weekly");

  useEffect(() => {
    // dispatch(getIncome(incomeRange));
    dispatch(getFinancialStatistics());
  }, []);

  useEffect(() => {
    dispatch(getIncome(incomeRange));
  }, [incomeRange]);

  return (
    <div className="flex flex-col py-2 px-2 xl:px-5">
      <Typography variant="h6" component="h2" className="!my-3">
        دید کلی
      </Typography>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 ">
        <StyledBox growth={Math.round(newOrders.growth)}>
          <Typography variant="subtitle1">سفارش های جدید</Typography>
          <div className="relative flex min-h-[37px] flex-col">
            {status === "loading" ? (
              <PulseLoader
                size={6}
                color={theme.palette.accent.main}
                loading={true}
                className="absolute top-[50%] right-0 -translate-y-[50%] -translate-x-[50%]"
              />
            ) : (
              <>
                <span className="growth">
                  {`${Math.round(newOrders.growth)}%`}
                  <Icon
                    icon={
                      newOrders.growth > 0
                        ? "arrow-up"
                        : newOrders.growth < 0
                        ? "arrow-down"
                        : ""
                    }
                    size={15}
                  />
                </span>
                <span>{newOrders.amount}</span>
              </>
            )}
          </div>
        </StyledBox>
        <StyledBox growth={Math.round(averageSales.growth)}>
          <Typography variant="subtitle1">میانگین فروش</Typography>
          <div className="relative flex min-h-[37px] flex-col">
            {status === "loading" ? (
              <PulseLoader
                size={6}
                color={theme.palette.accent.main}
                loading={true}
                className="absolute top-[50%] right-0 -translate-y-[50%] -translate-x-[50%]"
              />
            ) : (
              <>
                <span className="growth">
                  {`${Math.round(averageSales.growth)}%`}
                  <Icon
                    icon={
                      averageSales.growth > 0
                        ? "arrow-up"
                        : averageSales.growth < 0
                        ? "arrow-down"
                        : ""
                    }
                    size={15}
                  />
                </span>
                <span>{`${numberWithCommas(averageSales.amount)} `}</span>
              </>
            )}
          </div>
        </StyledBox>
        <StyledBox growth={Math.round(totalIncome.growth)}>
          <Typography variant="subtitle1">درآمد کل</Typography>
          <div className="relative flex min-h-[37px] flex-col">
            {status === "loading" ? (
              <PulseLoader
                size={6}
                color={theme.palette.accent.main}
                loading={true}
                className="absolute top-[50%] right-0 -translate-y-[50%] -translate-x-[50%]"
              />
            ) : (
              <>
                <span className="growth">
                  {`${Math.round(totalIncome.growth)}%`}
                  <Icon
                    icon={
                      totalIncome.growth > 0
                        ? "arrow-up"
                        : totalIncome.growth < 0
                        ? "arrow-down"
                        : ""
                    }
                    size={15}
                  />
                </span>
                <span>{`${numberWithCommas(totalIncome.amount)} `}</span>
              </>
            )}
          </div>
        </StyledBox>
      </div>
      <SaleStackChart />
      <div className="flex-1 ">
        <RevenueChart
          onIncomeRangeChange={setIncomeRange}
          incomeRange={incomeRange}
        />
      </div>
    </div>
  );
};

export default OverviewShop;
