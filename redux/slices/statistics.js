import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "adapters/statistics-adapter";

import { toast } from "react-toastify";

export const getTopProducts = createAsyncThunk(
  "statistics/get-top-products",
  async (
    { skip, search, sortBy, desc, itemsPerPage, range },
    { rejectWithValue }
  ) => {
    try {
      const { status, data } = await api.getTopProducts({
        skip,
        search,
        sortBy,
        desc,
        itemsPerPage,
        range,
      });
      if (status === 200) {
        return data;
      }
    } catch (e) {
      if (!e.response) {
        throw e;
      }
      if (e.response.status != 500) {
        toast.error(e?.response?.data?.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
      }
      return rejectWithValue(e?.response?.data);
    }
  }
);

export const getRecentTransactions = createAsyncThunk(
  "statistics/get-recent-transactions",
  async ({ skip, search, sortBy, desc, itemsPerPage }, { rejectWithValue }) => {
    try {
      const { status, data } = await api.getRecentTransactions({
        search,
        sortBy,
        desc,
        itemsPerPage,
        skip,
      });
      if (status === 200) {
        return data;
      }
    } catch (e) {
      if (!e.response) {
        throw e;
      }
      if (e.response.status != 500) {
        toast.error(e?.response?.data?.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
      }
      return rejectWithValue(e?.response?.data);
    }
  }
);

export const getProductViews = createAsyncThunk(
  "statistics/get-product-views",
  async ({ range }, { rejectWithValue }) => {
    try {
      const { status, data } = await api.getProductViews({
        range,
      });
      if (status === 200) {
        return data;
      }
    } catch (e) {
      if (!e.response) {
        throw e;
      }
      if (e.response.status != 500) {
        toast.error(e?.response?.data?.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
      }
      return rejectWithValue(e?.response?.data);
    }
  }
);

export const getLoyalCustomers = createAsyncThunk(
  "statistics/get-loyal-customers",
  async ({ skip }, { rejectWithValue }) => {
    try {
      const { status, data } = await api.getLoyalCustomers({
        skip,
      });
      if (status === 200) {
        return data;
      }
    } catch (e) {
      if (!e.response) {
        throw e;
      }
      if (e.response.status != 500) {
        toast.error(e?.response?.data?.message, {
          position: "bottom-center",
          closeOnClick: true,
        });
      }
      return rejectWithValue(e?.response?.data);
    }
  }
);

// Slice
const slice = createSlice({
  name: "statistics",
  initialState: {
    topProducts: { status: "idle", entity: [], totalCount: 0 },
    recentTransactions: { status: "idle", entity: [], totalCount: 0 },
    productViews: { status: "idle", entity: [], range: [] },
    loyalCustomers: { status: "idle", entity: [], totalCount: 0 },
    count: 0,
  },
  reducers: {},
  extraReducers: {
    [getTopProducts.fulfilled]: (state, action) => {
      if (action.meta.arg.search != "") {
        state.topProducts.entity = action.payload.topProducts;
      } else {
        state.topProducts.entity = [
          ...state.topProducts.entity,
          ...action.payload.topProducts,
        ];
      }
      state.topProducts.totalCount = action.payload.totalCount;
      state.topProducts.status = "idle";
    },
    [getTopProducts.pending]: (state) => {
      state.topProducts.status = "loading";
    },
    [getTopProducts.rejected]: (state) => {
      state.topProducts.status = "idle";
    },
    [getRecentTransactions.fulfilled]: (state, action) => {
      if (action.meta.arg.search != "") {
        state.recentTransactions.entity = action.payload.recentTransactions;
      } else {
        state.recentTransactions.entity = [
          ...state.recentTransactions.entity,
          ...action.payload.recentTransactions,
        ];
      }
      state.recentTransactions.totalCount = action.payload.totalCount;
      state.recentTransactions.status = "idle";
    },
    [getRecentTransactions.pending]: (state) => {
      state.recentTransactions.status = "loading";
    },
    [getRecentTransactions.rejected]: (state) => {
      state.recentTransactions.status = "idle";
    },
    [getProductViews.fulfilled]: (state, action) => {
      // state.productViews.entity = action.payload.incomes;
      state.productViews.entity = action.payload.productViews;
      state.productViews.range = action.payload.dateRange;
      state.productViews.status = "idle";
    },
    [getProductViews.pending]: (state) => {
      state.productViews.status = "loading";
    },
    [getProductViews.rejected]: (state) => {
      state.productViews.status = "idle";
    },
    [getLoyalCustomers.fulfilled]: (state, action) => {
      state.loyalCustomers.entity = [
        ...state.loyalCustomers.entity,
        ...action.payload.loyalCustomers,
      ];
      state.loyalCustomers.totalCount = action.payload.totalCount;
      state.loyalCustomers.status = "idle";
    },
    [getLoyalCustomers.pending]: (state) => {
      state.loyalCustomers.status = "loading";
    },
    [getLoyalCustomers.rejected]: (state) => {
      state.loyalCustomers.status = "idle";
    },
  },
});
export default slice.reducer;
