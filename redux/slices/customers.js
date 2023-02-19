import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "adapters/customers-adapter";

import { toast } from "react-toastify";

export const getCustomers = createAsyncThunk(
  "customers/get",
  async ({ page, search, sortBy, desc, itemsPerPage }, { rejectWithValue }) => {
    try {
      const { status, data } = await api.getCustomers({
        page,
        search,
        sortBy,
        desc,
        itemsPerPage,
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
  name: "customers",
  initialState: {
    status: "idle",
    entity: [],
    count: 0,
  },
  reducers: {},
  extraReducers: {
    [getCustomers.fulfilled]: (state, action) => {
      state.entity = action.payload.customers;
      state.count = action.payload.customersCount;
      state.status = "idle";
    },
    [getCustomers.pending]: (state) => {
      state.status = "loading";
    },
    [getCustomers.rejected]: (state, action) => {
      state.status = "idle";
    },
  },
});
export default slice.reducer;
