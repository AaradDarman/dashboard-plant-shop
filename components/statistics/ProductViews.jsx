import React, { useEffect, useState, memo } from "react";

import dynamic from "next/dynamic";
import {
  FormControl,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { css as Loadercss } from "@emotion/react";
import PulseLoader from "react-spinners/PulseLoader";

import useBreakPoints from "utils/useBreakPoints";
import { numberWithCommas, compactNumber } from "utils/number-helper";
import { useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getProductViews } from "redux/slices/statistics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const StyledWraper = styled(Paper)(({ theme }) => ({
  "&": {
    width: "100%",
    color: theme.palette.text.primary,
    backgroundColor: "transparent",
    backgroundImage: "none",
    position: "relative",
  },
  ".apexcharts-tooltip": {
    boxShadow: "0px 0px 6px -4px #999",
  },
  ".apexcharts-tooltip , .apexcharts-xaxistooltip.apexcharts-theme-dark": {
    background: theme.palette.primary.main,
    color: theme.palette.text.primary,
    borderColor: theme.palette.accent.main,
  },
  ".apexcharts-tooltip , .apexcharts-xaxistooltip.apexcharts-theme-dark:after":
    {
      borderBottomColor: theme.palette.accent.main,
    },
  ".apexcharts-tooltip.apexcharts-theme-dark .apexcharts-tooltip-title": {
    background: "inherit",
  },
}));

const ProductViews = ({ className }) => {
  const theme = useTheme();
  const breakPoints = useBreakPoints();
  const [incomeFilter, setIncomeFilter] = useState("weekly");

  const dispatch = useDispatch();
  const { entity, range, status } = useSelector(
    (state) => state.statistics.productViews
  );
  const { isSm } = breakPoints;
  const series = [
    {
      name: "بازدید",
      data: entity,
    },
  ];

  useEffect(() => {
    dispatch(getProductViews({ range: incomeFilter }));
    // eslint-disable-next-line
  }, [incomeFilter]);

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
      type: "bar",
      fontFamily: "BYekan",
      width: "100%",
      toolbar: {
        show: false,
      },
      foreColor: theme.palette.text.primary,
      background: "transparent",
      //   offsetY: 20,
    },
    tooltip: {
      theme: "dark",
      y: {
        // formatter: (val) => {
        //   return val !== 0 ? numberWithCommas(val) + " تومان" : "";
        // },
      },
    },
    colors: [theme.palette.accent.main],
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      type: "category",
      categories: range,
      labels: {
        // offsetY: isSm ? 0 : 30,
        offsetX: isSm ? 0 : -10,
      },
      position: "bottom",
      axisBorder: {
        show: true,
        color: "#ff0000",
        offsetX: isSm ? 10 : 0,
        offsetY: 0,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: theme.palette.accent.main,
            colorTo: theme.palette.accent.main,
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
        offsetY: 20,
        marker: {
          show: false,
        },
      },
    },
    yaxis: {
      showForNullSeries: false,
      forceNiceScale: true,
      min: 1,
      tickAmount: 5,
      labels: {
        offsetX: isSm ? -30 : -40,
        formatter: (val) => {
          if (val === 0) return "";
          return compactNumber(val);
        },
      },
    },
    grid: { show: false },
  };

  return (
    <StyledWraper
      sx={{ boxShadow: "none" }}
      className={`${className} relative h-[357px] rounded-[4px] border-[1px] border-secondary-dark-800 px-2`}
    >
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="!my-2 !text-right !text-[16px] ">
          تعداد بازدید
        </Typography>
        <FormControl sx={{ minWidth: 64 }} variant="standard">
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={incomeFilter}
            label=""
            onChange={(event) => setIncomeFilter(event.target.value)}
            className="min-h-[34px] rounded-md border-[1px] border-secondary-dark-800 pr-[0.7rem] pl-5"
            IconComponent={(props) => (
              <FontAwesomeIcon icon={faChevronDown} width={10} {...props} />
            )}
            sx={{
              fontSize: "14px !important",
              "&:hover:before": {
                border: "none !important",
              },
              "& .MuiInput-input": {
                paddingRight: "0 !important",
              },
              "& .MuiInput-input:focus": {
                backgroundColor: "unset",
              },
              "&:before": {
                display: "none",
                borderBottom: "none",
              },
              "&:after": {
                display: "none",
              },
              "& .MuiSelect-icon": {
                right: "6px",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: "secondary.main",
                  "& .MuiMenu-list": {
                    padding: 0,
                    fontSize: "14px !important",
                  },
                  "& .MuiMenuItem-root": {
                    fontSize: "14px !important",
                  },
                  "& .MuiMenuItem-root:hover": {
                    bgcolor: "primary.main",
                  },
                  "& .MuiMenuItem-root.Mui-selected": {
                    bgcolor: alpha(
                      theme.palette.accent.main,
                      theme.palette.action.activatedOpacity
                    ),
                  },
                  "& .MuiMenuItem-root.Mui-selected:hover": {
                    bgcolor: alpha(
                      theme.palette.accent.main,
                      theme.palette.action.activatedOpacity
                    ),
                  },
                },
              },
            }}
          >
            <MenuItem value="weekly">هفتگی</MenuItem>
            <MenuItem value="monthly">ماهانه</MenuItem>
            <MenuItem value="yearly">سالانه</MenuItem>
          </Select>
        </FormControl>
      </div>
      {status === "loading" ? (
        <PulseLoader
          size={6}
          color={theme.palette.accent.main}
          loading={true}
          className="absolute top-[50%] left-[50%] z-10 -translate-y-[50%] -translate-x-[50%]"
        />
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={290}
        />
      )}
    </StyledWraper>
  );
};

export default ProductViews;
