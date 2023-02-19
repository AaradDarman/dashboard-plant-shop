import React, { useEffect, useRef } from "react";

import { styled as MuiStyled } from "@mui/material/styles";
import styled from "styled-components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { rgba } from "polished";
import { PulseLoader, MoonLoader } from "react-spinners";
import { css as Loadercss } from "@emotion/react";

import useBreakpoints from "utils/useBreakPoints";
import useInfiniteScroll from "components/hooks/useInfiniteScroll";
import { useDispatch, useSelector } from "react-redux";
import { getLoyalCustomers } from "redux/slices/statistics";
import { numberWithCommas } from "utils/number-helper";

const LoyalCustomers = ({ className }) => {
  const parentRef = useRef(null);
  const breakPoints = useBreakpoints();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { entity, status, totalCount } = useSelector(
    (state) => state.statistics.loyalCustomers
  );

  const handleScrollEnd = () => {
    dispatch(getLoyalCustomers({ skip: entity.length }))
      .unwrap()
      .then(() => {
        setIsFetching(false);
      });
  };

  const [isFetching, setIsFetching] = useInfiniteScroll(
    parentRef,
    handleScrollEnd,
    entity.length === totalCount
  );

  useEffect(() => {
    dispatch(getLoyalCustomers({ skip: entity.length }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      {...breakPoints}
      style={{ direction: "ltr" }}
      className={`${className} relative flex flex-col overflow-hidden rounded-[4px] border-[1px] border-secondary-dark-800`}
    >
      <Typography variant="h6" className="!my-2 !px-2 !text-right !text-[16px]">
        مشتریان وفادار
      </Typography>
      <div ref={parentRef} className="flex-1 overflow-y-auto">
        {status === "loading" && entity.length === 0 ? (
          <PulseLoader
            size={6}
            color={theme.palette.accent.main}
            loading={true}
            className="absolute top-[50%] left-[50%] z-10 -translate-y-[50%] -translate-x-[50%]"
          />
        ) : entity.length == 0 ? (
          <span className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] text-[14px] text-gray-400">
            لیست خالی می باشد
          </span>
        ) : (
          entity?.map((client) => (
            <div
              className="flex justify-between py-2 px-2"
              style={{ direction: "rtl" }}
              key={client._id}
            >
              <div className="flex flex-col">
                <Typography variant="subtitle2">{`${client.fName} ${client.lName}`}</Typography>
                <Typography
                  variant="caption"
                  className="ml-[4px] text-gray-400"
                >
                  {client.email}
                </Typography>
              </div>
              <div className="flex flex-col">
                <Typography variant="subtitle2">
                  {numberWithCommas(client.totalBuy)}
                </Typography>
                <Typography
                  variant="caption"
                  className="ml-[4px] text-gray-400"
                >
                  سفارش ها
                </Typography>
              </div>
            </div>
          ))
        )}
        {isFetching && (
          <MoonLoader
            size={20}
            color={theme.palette.accent.main}
            loading={true}
            cssOverride={{
              left: "50%",
              position: "absolute",
              marginTop: "10px",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LoyalCustomers;
