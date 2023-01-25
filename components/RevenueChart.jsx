import React, { useEffect } from "react";

import dynamic from "next/dynamic";
import {
  calculateMonth,
  calculateWeek,
  calculateYear,
} from "utils/date-helper";
import { compactNumber, numberWithCommas } from "utils/number-helper";
import { useDispatch, useSelector } from "react-redux";
import { getIncome } from "redux/slices/analytics";
import { PulseLoader } from "react-spinners";
import { alpha, useTheme } from "@mui/system";
import { FormControl, MenuItem, Select, Typography } from "@mui/material";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RevenueChart = ({ onIncomeRangeChange, incomeRange }) => {
  const { income } = useSelector((state) => state.analytics);
  const theme = useTheme();
  const options = {
    noData: {
      text: "داده ای موجود نیست",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: "14px",
        fontFamily: undefined,
      },
    },
    chart: {
      fontFamily: "BYekan",
      foreColor: "#9a9b9f",
      minWidth: 0,
      width: "100%",
      type: "area",
      toolbar: {
        show: false,
      },
      zoom: { enabled: false },
      selection: {
        enabled: false,
      },
    },
    tooltip: { theme: "dark" },
    dataLabels: {
      enabled: false,
    },
    colors: ["#2cad42", "#b8860b", "#d80000"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        shadeIntensity: 0.8,
        opacityFrom: 0,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    grid: { show: false },
    xaxis: {
      categories: income.range,
      labels: {
        offsetY: 30,
        offsetX: -12,
        rotate: -45,
        rotateAlways: true,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return compactNumber(Math.floor(value));
        },
        offsetX: -30,
      },
    },
    legend: {
      markers: {
        offsetX: 5,
        offsetY: 0,
      },
    },
    // title: {
    //   text: "درآمد",
    //   floating: true,
    //   offsetY: -5,
    //   offsetX: -30,
    //   align: "right",
    // },
  };

  return (
    <div className="relative flex h-full min-h-[353px] flex-col">
      <div className="flex items-center justify-between pl-3">
        <Typography variant="h6" component="h3">
          درآمد
        </Typography>
        <FormControl sx={{ minWidth: 64 }} variant="standard">
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={incomeRange}
            label=""
            onChange={(event) => onIncomeRangeChange(event.target.value)}
            sx={{
              // border: "1px solid darkgrey",
              // color: "#fff",
              "&:before": {
                borderBottom: "none",
              },
              "& .MuiInputBase-root MuiSelect-root:hover:before": {
                borderBottom: "none",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: "secondary.main",
                  "& .MuiMenu-list": {
                    padding: 0,
                  },
                  "& .MuiMenuItem-root:hover": {
                    // padding: 2,
                    bgcolor: "primary.main",
                  },
                  "& .MuiMenuItem-root.Mui-selected": {
                    // padding: 2,
                    bgcolor: alpha(
                      theme.palette.accent.main,
                      theme.palette.action.activatedOpacity
                    ),
                  },
                },
              },
            }}
          >
            <MenuItem className="bg-red-400" value="weekly">
              هفتگی
            </MenuItem>
            <MenuItem value="monthly">ماهانه</MenuItem>
            <MenuItem value="yearly">سالانه</MenuItem>
          </Select>
        </FormControl>
      </div>
      {income.status === "loading" ? (
        <PulseLoader
          size={6}
          color={theme.palette.accent.main}
          loading={true}
          className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]"
        />
      ) : (
        <>
          <ReactApexChart
            options={options}
            series={[
              {
                name: "",
                data: income.entity,
              },
            ]}
            type="area"
            height={300}
          />
        </>
      )}
    </div>
  );
};

export default RevenueChart;
