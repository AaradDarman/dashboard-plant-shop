import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import product from "redux/slices/product";
import products from "redux/slices/products";
import orders from "redux/slices/orders";
import cart from "redux/slices/cart";
import user from "redux/slices/user";
import analytics from "redux/slices/analytics";
import discounts from "redux/slices/discounts";
import customers from "redux/slices/customers";
import customer from "redux/slices/customer";
import statistics from "redux/slices/statistics";
import { loadState } from "utils/browser-storage";
import { getInitialInfo } from "redux/slices/products";

const reducer = combineReducers({
  product,
  products,
  orders,
  cart,
  user,
  analytics,
  discounts,
  customers,
  customer,
  statistics,
});

const store = configureStore({
  reducer,
  devTools: true,
  preloadedState: { cart: loadState() },
});

store.dispatch(getInitialInfo());

export default store;
