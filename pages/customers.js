import React, { useEffect } from "react";

import Head from "next/head";

import MainLayout from "components/layouts/MainLayout";
import Cookies from "cookies";
import InventoryList from "components/inventory/InventoryList";
import { useDispatch, useSelector } from "react-redux";
import { getProductsInventory } from "redux/slices/products";
import { useState } from "react";
import { useContext } from "react";
import CustomersContext from "context/CustomersContext";
import { useDebounce } from "components/hooks/useDebounce";
import CustomersList from "components/customers/CustomersList";
import { customersContext } from "context/customers-context";
import { getCustomers } from "redux/slices/customers";

const Customers = () => {
  const dispatch = useDispatch();
  const { order, orderBy, page, rowsPerPage, search } =
    useContext(customersContext);

  let debouncedSeasrchTerm = useDebounce(search, 500);

  useEffect(() => {
    dispatch(
      getCustomers({
        page: page + 1,
        search: debouncedSeasrchTerm,
        sortBy: orderBy,
        desc: order === "desc" ? true : false,
        itemsPerPage: rowsPerPage,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSeasrchTerm, orderBy, order]);

  return (
    <>
      <Head>
        <title>مشتریان</title>
      </Head>
      <div className="rounded-[4px] border-[1px] border-secondary-dark-800">
        <CustomersList />
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

Customers.getLayout = function getLayout(page) {
  return (
    <MainLayout {...page.props}>
      <CustomersContext>{page}</CustomersContext>
    </MainLayout>
  );
};

export default Customers;
