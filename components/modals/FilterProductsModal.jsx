import React, { useContext, useEffect, useState } from "react";

import {
  Backdrop,
  Box,
  Checkbox,
  FormControlLabel,
  Modal,
  Slide,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { PulseLoader } from "react-spinners";

import MyAccordion from "components/MyAccordion";
import PriceRange from "components/PriceRange";
import { productsContext } from "context/products-context";

const ProductLights = ["مستقیم", "غیر مستقیم", "کم"];

const FilterProductsModal = ({ open, onClose }) => {
  const router = useRouter();
  const { size, light, minPrice, maxPrice } = router.query;

  const { products } = useSelector((state) => state);

  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      if (+router.query.page > 1) {
        router.query.page = "1";
      }
    };

    const handleChangeStart = (url) => {
      setIsLoading(true);
    };

    const handleChangeEnd = (url) => {
      setIsLoading(false);
    };

    router.events.on("beforeHistoryChange", handleRouteChange);
    router.events.on("routeChangeStart", handleChangeStart);
    router.events.on("routeChangeComplete", handleChangeEnd);
    router.events.on("routeChangeError", handleChangeEnd);

    return () => {
      router.events.off("beforeHistoryChange", handleRouteChange);
      router.events.off("routeChangeStart", handleChangeStart);
      router.events.off("routeChangeComplete", handleChangeEnd);
      router.events.off("routeChangeError", handleChangeEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    handleSizeFilterChange,
    handleLightFilterChange,
    handlePriceRangeFilterChange,
    filteredProductsCount,
  } = useContext(productsContext);

  return (
    <Modal
      aria-labelledby="filter-product-modal"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Slide direction="up" in={open}>
        <Box className="absolute left-0 right-0 bottom-0 border-none bg-white p-[4px] shadow-none dark:bg-primary-900">
          <MyAccordion title="سایز" className="px-2" open={size?.length}>
            {products.sizes.map((item) => (
              <FormControlLabel
                key={item}
                label={item}
                control={
                  <Checkbox
                    checked={
                      Array.isArray(size) ? size?.includes(item) : size === item
                    }
                    sx={{
                      // color: pink[800],
                      "&.Mui-checked": {
                        color:
                          theme.palette.mode === "dark"
                            ? "accent.main"
                            : "accent.600",
                      },
                    }}
                    alignIndicator="right"
                    onChange={() => handleSizeFilterChange(item)}
                  />
                }
                className="!mx-0 !flex flex-row-reverse !items-center justify-between"
              />
            ))}
          </MyAccordion>
          <MyAccordion title="نور" className="px-2" open={light?.length}>
            {ProductLights.map((item) => (
              <FormControlLabel
                key={item}
                label={item}
                control={
                  <Checkbox
                    checked={
                      Array.isArray(light)
                        ? light?.includes(item)
                        : light === item
                    }
                    sx={{
                      // color: pink[800],
                      "&.Mui-checked": {
                        color:
                          theme.palette.mode === "dark"
                            ? "accent.main"
                            : "accent.600",
                      },
                    }}
                    alignIndicator="right"
                    onChange={() => handleLightFilterChange(item)}
                  />
                }
                className="!mx-0 !flex flex-row-reverse !items-center justify-between"
              />
            ))}
          </MyAccordion>
          <MyAccordion
            title="محدوده قیمت"
            className="px-2"
            open={minPrice || maxPrice}
          >
            <PriceRange
              min={products.cheapest}
              max={products.mostExpensive}
              onRangeChange={handlePriceRangeFilterChange}
              range={[
                minPrice ?? products.cheapest,
                maxPrice ?? products.mostExpensive,
              ]}
            />
          </MyAccordion>
          <div
            onClick={onClose}
            className="border-t-solid flex items-center border-t-2 border-t-secondary-dark-800 px-[0.5rem] py-[1rem]"
          >
            مشاهده
            {isLoading ? (
              <PulseLoader
                // css={override}
                size={6}
                color={theme.palette.accent.main}
                loading={true}
              />
            ) : (
              ` ${filteredProductsCount} `
            )}
            محصول
            <FontAwesomeIcon
              className="mr-auto"
              icon={faChevronLeft}
              width={19}
            />
          </div>
        </Box>
      </Slide>
    </Modal>
  );
};

export default FilterProductsModal;
