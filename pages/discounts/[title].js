import React, { useEffect } from "react";

import Head from "next/head";

import MainLayout from "components/layouts/MainLayout";
import Cookies from "cookies";
import { useDispatch, useSelector } from "react-redux";
import { getDiscount } from "redux/slices/discounts";
import SkeletonProductLoading from "components/Products/SkeletonProductLoading";
import Image from "next/image";
import Product from "components/discounts/Product";
import { isEmpty } from "lodash";
import DiscountsContext from "context/DiscountsContext";
import noResultImg from "public/images/no-result.svg";
import { IconButton, Typography } from "@mui/material";
import { getPersianDate } from "utils/date-helper";
import Icon from "components/shared/Icon";
import { useRouter } from "next/router";

const Discount = ({ title }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { discount, status } = useSelector((state) => state.discounts);

  useEffect(() => {
    dispatch(getDiscount(title));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>{`تخفیفات | ${title}`}</title>
      </Head>
      <div className="flex items-center border-b-[1px] border-solid border-b-secondary-dark-200 py-4 dark:border-b-secondary-dark-800">
        <IconButton onClick={router.back} className="!text-[19px]">
          <Icon icon="arrow-right" size={19} />
        </IconButton>
        <Typography variant="body1">
          تخفیف
          <span className="mr-1 inline-block text-accent-600">{discount.title}</span>
        </Typography>
      </div>
      <Typography variant="subtitle1" className="!px-3">
        از
        <span className="mx-2">{getPersianDate(discount.startDate)}</span>
        تا
        <span className="mr-2">{getPersianDate(discount.endDate)}</span>
      </Typography>
      <div className="relative grid flex-1 grid-cols-1 gap-y-20 pt-32 lg:grid-cols-2 lg:gap-y-16 lg:pt-[3rem] xl:grid-cols-3 xl:gap-y-0 xl:px-4">
        {status === "loading" ? (
          Array(12)
            .fill()
            .map(() => Math.round(Math.random() * 6))
            .map((num) => (
              // eslint-disable-next-line react/jsx-key
              <div className="delay-50 transition-transform md:scale-[0.9] xl:scale-75">
                <SkeletonProductLoading />
              </div>
            ))
        ) : isEmpty(discount?.includes) ? (
          <div className="absolute top-[50%] left-[50%] flex -translate-y-[50%] -translate-x-[50%] flex-col items-center">
            <Image
              src={noResultImg}
              alt="no-result"
              className="drop-shadow-2xl"
            />
            <div>نتیجه ای یافت نشد</div>
          </div>
        ) : (
          discount?.includes?.map((item) => (
            <Product
              key={item._id}
              {...item}
              isExired={discount.status === "expired"}
              discountId={discount._id}
              className="delay-50 transition-transform md:scale-[0.9] md:hover:scale-90 xl:scale-75"
            />
          ))
        )}
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const cookies = new Cookies(ctx.req, ctx.res);
  const authorization = cookies.get("authorization");
  if (!authorization) {
    return {
      redirect: {
        destination: `/users/login?returnUrl=${ctx.resolvedUrl}&forceLogout=true`,
        permanent: false,
      },
    };
  }

  return {
    props: { title: ctx.params.title },
  };
}

Discount.getLayout = function getLayout(page) {
  return (
    <MainLayout {...page.props}>
      <DiscountsContext>{page}</DiscountsContext>
    </MainLayout>
  );
};

export default Discount;
