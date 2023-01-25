import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "adapters/analytics-adapter";

import { toast } from "react-toastify";
import unionBy from "lodash/unionBy";

export const getOrders = createAsyncThunk(
  "orders/get",
  async ({ page, search, sortBy, desc, status: queryStatus, itemsPerPage }) => {
    console.log(search, sortBy, desc);
    try {
      const { status, data } = await api.getOrders({
        page,
        search,
        sortBy,
        desc,
        status: queryStatus,
        itemsPerPage,
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

export const cancelOrders = createAsyncThunk(
  "orders/cancel",
  async (orderIds) => {
    console.log(orderIds);
    try {
      const { status, data } = await api.cancelOrders(orderIds);
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

export const sendOrders = createAsyncThunk(
  "orders/send",
  async ({ orderId, postTrackingNumber }) => {
    console.log(orderId, postTrackingNumber);
    try {
      const { status, data } = await api.sendOrders(
        orderId,
        postTrackingNumber
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

// Slice
const slice = createSlice({
  name: "orders",
  initialState: {
    status: "idle",
    entity: [],
    count: 0,
  },
  reducers: {},
  extraReducers: {
    [getOrders.fulfilled]: (state, action) => {
      state.entity = action.payload.orders;
      state.count = action.payload.ordersCount;
      state.status = "idle";
    },
    [getOrders.pending]: (state) => {
      state.status = "loading";
    },
    [cancelOrders.fulfilled]: (state, action) => {
      state.entity = unionBy(action.payload.updatedOrders, state.entity, "_id");
      state.status = "idle";
    },
    [cancelOrders.pending]: (state) => {
      state.status = "canceling";
    },
    [sendOrders.fulfilled]: (state, action) => {
      state.entity = unionBy(
        [action.payload.updatedOrder],
        state.entity,
        "_id"
      );
      state.status = "idle";
    },
    [sendOrders.pending]: (state) => {
      state.status = "sending";
    },
    // [addNewProduct.fulfilled]: (state, action) => {
    //   state.entity.unshift(action.payload);
    //   state.status = "idle";
    // },
    // [addNewProduct.pending]: (state) => {
    //   state.status = "creating";
    // },
    // [editProduct.fulfilled]: (state, action) => {
    //   let productIndex = state?.entity?.findIndex(
    //     (p) => p?._id === action.payload?._id
    //   );
    //   state.entity[productIndex] = action.payload;
    //   state.status = "idle";
    // },
    // [editProduct.pending]: (state) => {
    //   state.status = "editing";
    // },
    // [deleteProduct.fulfilled]: (state, action) => {
    //   state.entity = state.entity.filter((p) => p._id !== action.payload);
    //   state.status = "idle";
    // },
    // [deleteProduct.pending]: (state) => {
    //   state.status = "deleting";
    // },
    // [getInitialInfo.fulfilled]: (state, action) => {
    //   state.cheapest = action.payload?.cheapest;
    //   state.mostExpensive = action.payload?.mostExpensive;
    //   state.categories = action.payload?.categories;
    //   state.sizes = action.payload?.sizes;
    //   state.status = "idle";
    // },
    // [getInitialInfo.pending]: (state) => {
    //   state.status = "loading";
    // },
  },
});
export default slice.reducer;
