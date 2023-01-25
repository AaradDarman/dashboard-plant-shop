import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "adapters/adapter";

import { toast } from "react-toastify";

export const getCategories = createAsyncThunk("categories/get", async () => {
  try {
    const { status, data } = await api.getCategories();
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
});

const slice = createSlice({
  name: "categories",
  initialState: { status: "idle", entity: [] },
  reducers: {},
  extraReducers: {
    [getCategories.fulfilled]: (state, action) => {
      state.entity = action.payload.categories;
      state.status = "idle";
    },
    [getCategories.pending]: (state) => {
      state.status = "loading";
    },
    [getCategories.rejected]: (state) => {
      state.status = "idle";
    },
  },
});
export default slice.reducer;
