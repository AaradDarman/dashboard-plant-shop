import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "adapters/customers-adapter";

import { toast } from "react-toastify";

export const getOrders = createAsyncThunk(
  "customer/get-orders",
  async (id, { rejectWithValue }) => {
    try {
      const { status, data } = await api.getOrders(id);
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
  name: "customer",
  initialState: {
    status: "idle",
    orders: [],
    count: 0,
  },
  reducers: {},
  extraReducers: {
    [getOrders.fulfilled]: (state, action) => {
      state.orders = action.payload.orders;
      state.status = "idle";
    },
    [getOrders.pending]: (state) => {
      state.status = "loading";
    },
    [getOrders.rejected]: (state) => {
      state.status = "idle";
    },
  },
});
export default slice.reducer;
