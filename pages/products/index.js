import React, { useContext, useEffect } from "react";

import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faArrowDownWideShort,
} from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import _Map from "lodash/map";
import { Button } from "@mui/material";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import ProductsContext from "context/ProductsContext";
import { productsContext } from "context/products-context";
import MainLayout from "components/layouts/MainLayout";
import SortProducts from "components/Products/SortProducts";
import withPagination from "components/HOC/withPagination";
import ProductsList from "components/Products";
import { getProducts } from "redux/slices/products";
import Cookies from "cookies";

const sortOptions = {
  newest: "جدیدترین",
  bestSelling: "پرفروش ترین",
  mostVisited: "پر بازدیدترین",
  cheapest: "ارزانترین",
  mostExpensive: "گرانترین",
};

const ProductsWithPagination = withPagination(({ ...otherProps }) => (
  <ProductsList {...otherProps} />
));

const Products = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { entity, count } = useSelector((state) => state.products);

  const {
    openFilterModal,
    openSortModal,
    handleSortChange,
    handlePageChange,
    setFilteredProductsCount,
  } = useContext(productsContext);

  useEffect(() => {
    dispatch(
      getProducts({
        page: router.query.page || 1,
        sortBy: router.query.sortBy || "newest",
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    setFilteredProductsCount(count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div className="rounded-[4px] border-[1px] border-secondary-dark-800">
      <Head>
        <title>محصولات</title>
      </Head>
      <div className="flex p-4">
        <Link href="/products/create">
          <a className="relative z-10 rounded-md bg-accent-800 py-2 px-6 text-white shadow-md shadow-accent-500">
            افزودن محصول
          </a>
        </Link>
      </div>
      <SortProducts
        className="hidden px-4 md:flex"
        onTabChange={handleSortChange}
      />
      <div className="flex items-center md:hidden">
        <Button
          onClick={openFilterModal}
          className="!text-[14px]  !text-inherit hover:!text-accent-700"
          startIcon={<FontAwesomeIcon width={19} icon={faFilter} />}
        >
          فیلتر
        </Button>
        <Button
          variant="text"
          className="!text-[14px] !text-inherit hover:!text-accent-700"
          onClick={openSortModal}
          startIcon={<FontAwesomeIcon width={19} icon={faArrowDownWideShort} />}
        >
          {!router.query.sortBy ? "جدیدترین" : sortOptions[router.query.sortBy]}
        </Button>
        <div className="mr-auto flex items-center text-[13px]">
          {count}
          محصول
        </div>
      </div>
      <ProductsWithPagination
        itemsPerPage={12}
        totalItems={count}
        handleChangePage={handlePageChange}
        currentPage={+router?.query?.page || 1}
        products={entity}
        className="px-4"
      />
    </div>
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

Products.getLayout = function getLayout(page) {
  return (
    <MainLayout {...page.props}>
      <ProductsContext>{page}</ProductsContext>
    </MainLayout>
  );
};

export default Products;
