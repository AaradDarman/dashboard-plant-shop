import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { Slider, useTheme } from "@mui/material";

import { useDebounce } from "./hooks/useDebounce";
import { useFirstRender } from "./hooks/useFirstRender";
import useBreakpoints from "utils/useBreakPoints";

const StyledWraper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PriceRange = ({ min, max, onRangeChange, range }) => {
  const [minInput, setMinInput] = useState(min);
  const [maxInput, setMaxInput] = useState(max);

  const theme = useTheme();
  const { isSm } = useBreakpoints();

  const [mounted, setMounted] = useState(false);
  const firstRender = useFirstRender();

  useEffect(() => {
    setMinInput(range[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range[0]]);

  useEffect(() => {
    setMaxInput(range[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range[1]]);

  const minValidate = () => {
    if (minInput < min || minInput > max) {
      setMinInput(min);
      onRangeChange([min, range[1]]);
    } else if (minInput != range[0]) {
      onRangeChange([minInput, maxInput]);
    }
  };

  const maxValidate = () => {
    if (maxInput > max || maxInput < min) {
      setMaxInput(max);
      onRangeChange([range[0], max]);
    } else if (maxInput != range[1]) {
      onRangeChange([minInput, maxInput]);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  let debouncedMinPrice = useDebounce(minInput, 2000);
  let debouncedMaxPrice = useDebounce(maxInput, 2000);

  useEffect(() => {
    !firstRender && minValidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMinPrice]);

  useEffect(() => {
    !firstRender && maxValidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMaxPrice]);

  if (!mounted) return null;

  const handleMinChange = (e) => {
    setMinInput(+e.target.value);
  };

  const handleMaxChange = (e) => {
    setMaxInput(+e.target.value);
  };

  return (
    <StyledWraper theme={theme} isSm={isSm}>
      <label htmlFor="min-price-input">از</label>
      <input
        id="min-price-input"
        value={minInput}
        onChange={handleMinChange}
        type="number"
        min={"" + min}
        max={"" + max}
        className="mb-4 rounded-md border border-secondary-dark-800 bg-transparent py-2 px-2 caret-accent-800 outline-none focus:border-accent-800"
      />
      <label htmlFor="max-price-input">تا</label>
      <input
        id="max-price-input"
        onChange={handleMaxChange}
        value={maxInput}
        min={"" + min}
        max={"" + max}
        type="number"
        className="mb-4 rounded-md border border-secondary-dark-800 bg-transparent py-2 px-2 caret-accent-800 outline-none focus:border-accent-800"
      />
      <Slider
        defaultValue={range}
        min={min}
        max={max}
        valueLabelDisplay="auto"
        onChangeCommitted={(e, val) => onRangeChange(val)}
        sx={{
          "&": {
            width: "calc(100% - 30px)",
            alignSelf: "center",
          },
          "& .MuiSlider-thumb": {
            backgroundColor:
              theme.palette.mode === "dark" ? "accent.main" : "accent.600",
          },
          "& .MuiSlider-valueLabel": {
            backgroundColor:
              theme.palette.mode === "dark" ? "primary.800" : "primary.600",
          },
          "& .MuiSlider-track": {
            backgroundColor:
              theme.palette.mode === "dark" ? "accent.main" : "accent.600",
          },
          "& .MuiSlider-rail": {
            boxShadow: "inset 0 1px 1px #194656, 0 3px 6px -5px #05313f",
          },
        }}
      />
      <div className="flex justify-between">
        <span>ارزان ترین</span>
        <span>گرانترین</span>
      </div>
    </StyledWraper>
  );
};

export default PriceRange;
