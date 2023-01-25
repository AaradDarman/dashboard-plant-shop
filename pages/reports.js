import React from "react";

import Head from "next/head";

import MainLayout from "components/layouts/MainLayout";
import Cookies from "cookies";

const Reports = () => {
  return (
    <>
      <Head>
        <title>گزارشات</title>
      </Head>
      گزارشات
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
  return <MainLayout {...page.props}>{page}</MainLayout>;
};

export default Reports;
