import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import api from "adapters/adapter";

export const getProduct = createAsyncThunk(
  "product/get",
  async (id, { rejectWithValue }) => {
    try {
      const { status, data } = await api.getProduct(id);
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

const productSlice = createSlice({
  name: "product",
  initialState: { status: "idle", entity: {} },
  reducers: {},
  extraReducers: {
    [getProduct.fulfilled]: (state, action) => {
      state.entity = action.payload?.product;
      state.status = "idle";
    },
    [getProduct.rejected]: (state, action) => {
      state.status = "idle";
    },
    [getProduct.pending]: (state) => {
      state.status = "loading";
    },
  },
});
export default productSlice.reducer;
