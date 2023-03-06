import React, { useEffect } from "react";

import Head from "next/head";

import MainLayout from "components/layouts/MainLayout";
import Cookies from "cookies";
import InventoryList from "components/inventory/InventoryList";
import { useDispatch, useSelector } from "react-redux";
import { getProductsInventory } from "redux/slices/products";
import { useState } from "react";
import { useContext } from "react";
import { inventoryContext } from "context/inventory-context";
import InventoryContext from "context/InventoryContext";
import { useDebounce } from "components/hooks/useDebounce";

const Inventory = () => {
  const dispatch = useDispatch();
  const { order, orderBy, page, rowsPerPage, search, onlyOutOfStock } =
    useContext(inventoryContext);

  let debouncedSeasrchTerm = useDebounce(search, 500);

  useEffect(() => {
    dispatch(
      getProductsInventory({
        page: page + 1,
        search: debouncedSeasrchTerm,
        sortBy: orderBy,
        desc: order === "desc" ? true : false,
        itemsPerPage: rowsPerPage,
        status: onlyOutOfStock ? "out-of-stock" : undefined,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSeasrchTerm, onlyOutOfStock, orderBy, order]);

  return (
    <>
      <Head>
        <title>لیست موجودی</title>
      </Head>
      <div className="rounded-[4px] border-[1px] border-secondary-dark-800">
        <InventoryList />
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

Inventory.getLayout = function getLayout(page) {
  return (
    <MainLayout {...page.props}>
      <InventoryContext>{page}</InventoryContext>
    </MainLayout>
  );
};

export default Inventory;
