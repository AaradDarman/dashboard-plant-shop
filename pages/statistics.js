import React from "react";

import Head from "next/head";

import MainLayout from "components/layouts/MainLayout";
import Cookies from "cookies";
import TopProducts from "components/statistics/TopProducts";
import RecentTransactions from "components/statistics/RecentTransactions";
import ProductViews from "components/statistics/ProductViews";
import LoyalCustomers from "components/statistics/LoyalCustomers";
import StatisticsContext from "context/StatisticsContext";

const Reports = () => {
  return (
    <>
      <Head>
        <title>گزارشات</title>
      </Head>
      <div className="grid grid-cols-12 gap-2">
        <LoyalCustomers className="col-span-12 lg:col-span-3" />
        <ProductViews className="col-span-12 lg:col-span-9" />
        <RecentTransactions className="col-span-full min-h-[270px] lg:col-span-7" />
        <TopProducts className="col-span-full min-h-[270px] lg:col-span-5" />
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
    props: {},
  };
}

Reports.getLayout = function getLayout(page) {
  return (
    <MainLayout {...page.props}>
      <StatisticsContext>{page}</StatisticsContext>
    </MainLayout>
  );
};

export default Reports;
