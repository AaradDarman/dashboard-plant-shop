import React, { useEffect, useRef, useState } from "react";

import { Tab, Tabs, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useContext } from "react";
import { productsContext } from "context/products-context";
import { PulseLoader } from "react-spinners";

const SortProducts = ({ className, onTabChange }) => {
  const [width, setWidth] = useState(0);
  const [position, setPosition] = useState(0);
  const parentRef = useRef(null);
  const router = useRouter();
  const { filteredProductsCount } = useContext(productsContext);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleChangeStart = (url) => {
      if (
        url === "/" ||
        url.startsWith("/orders") ||
        url.startsWith("/products/") ||
        url.startsWith("/checkout") ||
        url.startsWith("/users/login") ||
        url.startsWith("/users/signup") ||
        url.startsWith("/dashboard")
      )
        return;
      setIsLoading(true);
    };

    const handleChangeEnd = (url) => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleChangeStart);
    router.events.on("routeChangeComplete", handleChangeEnd);
    router.events.on("routeChangeError", handleChangeEnd);

    return () => {
      router.events.off("routeChangeStart", handleChangeStart);
      router.events.off("routeChangeComplete", handleChangeEnd);
      router.events.off("routeChangeError", handleChangeEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseOver = (e) => {
    const parent = parentRef.current.getBoundingClientRect();
    const rect = e.target.getBoundingClientRect();
    setWidth(rect.width);
    setPosition(rect.left - parent.left);
  };

  const handleMouseLeave = () => {
    setWidth(0);
  };

  return (
    <div
      className={`${className} flex items-center border-b-[1px] border-solid border-b-secondary-dark-200 py-2 dark:border-b-secondary-dark-800`}
    >
      <div className="inline-flex">
        <FontAwesomeIcon fixedWidth size="lg" icon={faArrowDownWideShort} />
        <span className="hidden lg:inline">مرتب سازی:</span>
      </div>
      <Tabs
        sx={{
          "& .MuiTab-root.Mui-selected": {
            color: theme.palette.mode === "dark" ? "accent.main" : "accent.600",
          },
          "& .MuiTabs-indicator": {
            backgroundColor:
              theme.palette.mode === "dark" ? "accent.main" : "accent.600",
          },
        }}
        className="relative flex flex-1"
        ref={parentRef}
        value={!router.query.sortBy ? "newest" : router.query.sortBy}
        onChange={(event, value) => onTabChange(value)}
      >
        <Tab
          label="جدیدترین"
          value="newest"
          onMouseLeave={handleMouseLeave}
          onMouseOver={handleMouseOver}
        />
        <Tab
          label="پرفروش ترین"
          value="bestSelling"
          onMouseLeave={handleMouseLeave}
          onMouseOver={handleMouseOver}
        />
        <Tab
          label="پر بازدیدترین"
          value="mostVisited"
          onMouseLeave={handleMouseLeave}
          onMouseOver={handleMouseOver}
        />
        <Tab
          label="ارزانترین"
          value="cheapest"
          onMouseLeave={handleMouseLeave}
          onMouseOver={handleMouseOver}
        />
        <Tab
          label="گرانترین"
          value="mostExpensive"
          onMouseLeave={handleMouseLeave}
          onMouseOver={handleMouseOver}
        />
        <div
          className={`absolute bottom-0 h-[2px] bg-accent-600 transition-all dark:bg-accent-500`}
          style={{ width: parseInt(width), left: position }}
        />
      </Tabs>
      <div className="flex items-center text-[13px]">
        {isLoading ? (
          <PulseLoader
            // css={override}
            size={6}
            color={theme.palette.accent.main}
            loading={true}
          />
        ) : (
          filteredProductsCount ?? (
            <PulseLoader
              // css={override}
              size={6}
              color={theme.palette.accent.main}
              loading={true}
            />
          )
        )}
        محصول
      </div>
    </div>
  );
};

export default SortProducts;
