import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "adapters/analytics-adapter";

import { toast } from "react-toastify";

export const getRecentOrders = createAsyncThunk(
  "analytics/recent-orders",
  async ({ itemsPerPage, page, search, sortBy, desc, queryStatus }) => {
    try {
      const { status, data } = await api.getOrders({
        itemsPerPage,
        page,
        search,
        sortBy,
        desc,
        status: queryStatus,
      });
      if (status === 200) {
        return data;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const getProductsStock = createAsyncThunk(
  "analytics/products-stock",
  async ({ search, sortBy, desc }) => {
    try {
      const { status, data } = await api.getProductsStock(search, sortBy, desc);
      if (status === 200) {
        return data;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const loadMoreProductsStock = createAsyncThunk(
  "analytics/load-more-products-stock",
  async ({ search, sortBy, desc, skip }) => {
    try {
      const { status, data } = await api.getProductsStock(
        search,
        sortBy,
        desc,
        skip
      );
      if (status === 200) {
        return data;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const getIncome = createAsyncThunk(
  "analytics/get-income",
  async (range) => {
    try {
      const { status, data } = await api.getIncome(range);
      if (status === 200) {
        console.log(data);
        return data;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const getFinancialStatistics = createAsyncThunk(
  "analytics/get-financial-statistics",
  async () => {
    try {
      const { status, data } = await api.getFinancialStatistics();
      if (status === 200) {
        console.log(data);
        return data;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

// Slice
const slice = createSlice({
  name: "analytics",
  initialState: {
    recentOrders: { status: "idle", entity: [] },
    productsStock: { status: "idle", entity: [], totalCount: 0 },
    financialStatistics: {
      status: "idle",
      totalIncome: { amount: 0, growth: 0 },
      averageSales: { amount: 0, growth: 0 },
      newOrders: { amount: 0, growth: 0 },
      ordersCount: [],
    },
    income: {
      status: "idle",
      entity: [],
      range: [],
    },
  },
  reducers: {},
  extraReducers: {
    [getRecentOrders.fulfilled]: (state, action) => {
      state.recentOrders.entity = action.payload.orders;
      state.recentOrders.status = "idle";
    },
    [getRecentOrders.pending]: (state) => {
      state.recentOrders.status = "loading";
    },
    [getProductsStock.fulfilled]: (state, action) => {
      state.productsStock.entity = action.payload.productsStock;
      state.productsStock.totalCount = action.payload.totalCount;
      state.productsStock.status = "idle";
    },
    [getProductsStock.pending]: (state) => {
      state.productsStock.status = "loading";
    },
    [loadMoreProductsStock.fulfilled]: (state, action) => {
      state.productsStock.entity = [
        ...state.productsStock.entity,
        ...action.payload.productsStock,
      ];
      state.productsStock.totalCount = action.payload.totalCount;
    },
    [getIncome.fulfilled]: (state, action) => {
      state.income.entity = action.payload.incomes;
      state.income.range = action.payload.dateRange;
      state.income.status = "idle";
    },
    [getIncome.pending]: (state) => {
      state.income.status = "loading";
    },
    [getFinancialStatistics.fulfilled]: (state, action) => {
      state.financialStatistics.totalIncome = action.payload.totalIncome;
      state.financialStatistics.newOrders = action.payload.newOrders;
      state.financialStatistics.averageSales = action.payload.averageSales;
      state.financialStatistics.ordersCount = action.payload.ordersCount;
      state.financialStatistics.status = "idle";
    },
    [getFinancialStatistics.pending]: (state) => {
      state.financialStatistics.status = "loading";
    },
  },
});
export default slice.reducer;
