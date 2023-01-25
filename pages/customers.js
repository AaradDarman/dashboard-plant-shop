import React from "react";

import Head from "next/head";

import MainLayout from "components/layouts/MainLayout";
import Cookies from "cookies";

const Customers = () => {
  return (
    <>
      <Head>
        <title>مشتریان</title>
      </Head>
      مشتریان
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

Customers.getLayout = function getLayout(page) {
  return <MainLayout {...page.props}>{page}</MainLayout>;
};

export default Customers;
