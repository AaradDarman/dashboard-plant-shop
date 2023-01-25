import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import Image from "next/image";

import Product from "components/Product";
import ProductContext from "context/ProductContext";
import SkeletonProductLoading from "./SkeletonProductLoading";
import noResultImg from "public/images/no-result.svg";

const Products = ({ products, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      if (+router.query.page > 1) {
        router.query.page = "1";
      }
    };

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

  return (
    <ProductContext>
      <div
        className={`${className} relative grid flex-1 grid-cols-1 gap-y-20 pt-32 lg:grid-cols-2 lg:gap-y-16 lg:pt-[3rem] xl:grid-cols-3 xl:gap-y-0`}
      >
        {isLoading ? (
          Array(12)
            .fill()
            .map(() => Math.round(Math.random() * 6))
            .map((num) => (
              // eslint-disable-next-line react/jsx-key
              <div className="delay-50 transition-transform md:scale-[0.9] xl:scale-75">
                <SkeletonProductLoading />
              </div>
            ))
        ) : isEmpty(products) ? (
          <div className="absolute top-[50%] left-[50%] flex -translate-y-[50%] -translate-x-[50%] flex-col items-center">
            <Image
              src={noResultImg}
              alt="no-result"
              className="drop-shadow-2xl"
            />
            <div>نتیجه ای یافت نشد</div>
          </div>
        ) : (
          products.map((item) => (
            <Product
              key={item._id}
              {...item}
              className="delay-50 transition-transform md:scale-[0.9] md:hover:scale-90 xl:scale-75"
            />
          ))
        )}
      </div>
    </ProductContext>
  );
};

export default Products;
