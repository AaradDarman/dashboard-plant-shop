import Head from "next/head";

import MainLayout from "components/layouts/MainLayout";
import OverviewShop from "components/OverviewShop";
import LatestOrders from "components/LatestOrders";
import Cookies from "cookies";

export default function Home({ ...otherProps }) {
  return (
    <MainLayout {...otherProps}>
      <Head>
        <title>خلاصه فعالیت ها</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{ minHeight: "calc(100vh - 66px)" }}
        className="relative grid flex-1 grid-cols-1 gap-1 rounded-[4px] border-[1px] border-secondary-dark-800 lg:grid-cols-2"
      >
        <OverviewShop />
        <LatestOrders />
      </div>
    </MainLayout>
  );
}

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
