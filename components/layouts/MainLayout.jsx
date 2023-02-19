import React from "react";

import styled, { css } from "styled-components";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch } from "react-redux";

import Icon from "components/shared/Icon";
import { resetUser } from "redux/slices/user";
import { resetLocalCart } from "redux/slices/cart";
import useBreakpoints from "utils/useBreakPoints";
import { useTheme } from "@mui/material";
import clsx from "clsx";

const stickyStyle = css`
  position: sticky;
  top: 1rem;
`;

const StyledAside = styled.nav`
  width: ${({ isLg }) => (isLg ? "205px" : "100%")};
  height: ${({ isLg }) => (isLg ? "calc(100vh - 2rem)" : "unset")};
  margin-top: ${({ isLg }) => !isLg && "1rem"};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.palette.secondary[800]};
  border-radius: 4px;
  overflow-x: hidden;
  z-index: 1;
  display: flex;
  flex-direction: column;
  ${({ isLg }) => isLg && stickyStyle};
  .navigation-menu {
    list-style: none;
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-bottom: 0;
    padding: 0;
  }
  .menu-item {
    display: flex;
    align-items: center;
    width: inherit;
    position: relative;
    opacity: 0.7;
    margin: 0.6rem 0;
    padding: 0 0.7rem;
    transition: color 0.6s ease, background-color 0.3s ease, border 0.6s ease,
      opacity 0.3s;
  }
  .menu-item:not(.active):hover {
    opacity: 1;
    transition: color 0.3s ease;
  }
  .menu-item:not(.active):hover a {
    background-color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.primary[800]
        : "rgba(0, 0, 0, 0.1)"};
  }
  .menu-item:not(.active):hover a .icon {
    color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.accent[900]
        : theme.palette.accent[600]};
    transition: color 0.3s ease;
  }
  .menu-item:not(.active):hover a span::after {
    background-color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.accent[900]
        : theme.palette.accent[600]};
    width: 100%;
  }
  .menu-item.active a span::after {
    background-color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.accent[900]
        : theme.palette.accent[600]};
    width: 100%;
  }
  .menu-item.active a .icon {
    color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.accent[900]
        : theme.palette.accent[600]};
  }
  .menu-item.active {
    opacity: 1;
  }
  .menu-item a {
    text-decoration: none;
    color: inherit;
    width: 100%;
    flex: 1;
    padding: 0.3rem;
    border-radius: 0.6rem;
    transition: all 0.3s ease;
  }
  .menu-item a span {
    position: relative;
  }
  .menu-item a span::after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    width: 0;
    background-color: transparent;
    transition: all 0.3s ease;
  }
  .menu-item .icon {
    margin-left: 1rem;
  }
`;

const routesTitles = {
  "/profile": "",
  "/profile/orders": "| سفارش ها",
  "/profile/addresses": "| آدرس ها",
  "/profile/personal-info": "| اطلاعات حساب کاربری",
};

const MainLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLg } = useBreakpoints();
  const theme = useTheme();

  const logout = async (e) => {
    e.preventDefault();
    try {
      await axios.get("/api/auth/logout");
      dispatch(resetUser());
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-wrap-reverse items-start p-4 lg:flex-wrap">
      <StyledAside theme={theme} isLg={isLg}>
        <ul className="navigation-menu">
          <li
            className={`menu-item${router.pathname === "/" ? " active" : ""}`}
          >
            <Link href="/">
              <a>
                <Icon
                  className="icon"
                  icon={`${
                    router.pathname === "/" ? "dashboard-filled" : "dashboard"
                  }`}
                  size={22}
                />
                <span>خلاصه فعالیت ها</span>
              </a>
            </Link>
          </li>
          <li
            className={`menu-item${
              router.pathname.includes("/products") ? " active" : ""
            }`}
          >
            <Link href="/products">
              <a>
                <Icon
                  className="icon"
                  icon={`${
                    router.pathname === "/products" ? "plant-filled" : "plant"
                  }`}
                  size={24}
                />
                <span>محصولات</span>
              </a>
            </Link>
          </li>
          <li
            className={`menu-item${
              router.pathname.includes("/inventory") ? " active" : ""
            }`}
          >
            <Link href="/inventory">
              <a>
                <Icon
                  className="icon"
                  icon={`${
                    router.pathname === "/inventory"
                      ? "inventory-filled"
                      : "inventory"
                  }`}
                  size={24}
                />
                <span>موجودی محصولات</span>
              </a>
            </Link>
          </li>
          <li
            className={`menu-item${
              router.pathname === "/orders" ? " active" : ""
            }`}
          >
            <Link href="/orders">
              <a>
                <Icon
                  className="icon"
                  icon={`${
                    router.pathname === "/orders" ? "orders-filled" : "orders"
                  }`}
                  size={24}
                />
                <span>سفارش ها</span>
              </a>
            </Link>
          </li>
          <li
            className={`menu-item${
              router.pathname === "/customers" ? " active" : ""
            }`}
          >
            <Link href="/customers">
              <a>
                <Icon
                  className="icon"
                  icon={`${
                    router.pathname === "/customers" ? "group-filled" : "group"
                  }`}
                  size={24}
                />
                <span>مشتریان</span>
              </a>
            </Link>
          </li>
          <li
            className={`menu-item${
              router.pathname.includes("/discounts") ? " active" : ""
            }`}
          >
            <Link href="/discounts">
              <a>
                <Icon
                  className="icon"
                  icon={`${
                    router.pathname === "/discounts"
                      ? "discount-filled"
                      : "discount"
                  }`}
                  size={24}
                />
                <span>تخفیفات</span>
              </a>
            </Link>
          </li>
          <li
            className={`menu-item${
              router.pathname === "/statistics" ? " active" : ""
            }`}
          >
            <Link href="/statistics">
              <a>
                <Icon
                  className="icon"
                  icon={`${
                    router.pathname === "/statistics"
                      ? "reports-filled"
                      : "reports"
                  }`}
                  size={24}
                />
                <span>گزارشات</span>
              </a>
            </Link>
          </li>
          <li className="menu-item !mt-auto">
            <Link href="/logout">
              <a onClick={logout}>
                <Icon className="icon" icon="logout" size={22} />
                <span>خروج</span>
              </a>
            </Link>
          </li>
        </ul>
      </StyledAside>
      <section
        className={clsx(
          "profile-main-section relative mr-0",
          "w-full flex-1",
          "lg:mr-2 lg:w-auto"
        )}
      >
        {children}
      </section>
    </div>
  );
};

export default MainLayout;
