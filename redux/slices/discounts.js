import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "adapters/discount-adapter";

import { toast } from "react-toastify";

export const getDiscounts = createAsyncThunk("discounts/get", async () => {
  try {
    const { status, data } = await api.getDiscounts();
    if (status === 200) {
      return data;
    }
  } catch (e) {
    toast.error(e?.response?.data?.message, {
      position: "bottom-center",
      closeOnClick: true,
    });
  }
});

export const getDiscount = createAsyncThunk(
  "discounts/get-discount",
  async (title) => {
    try {
      const { status, data } = await api.getDiscount(title);
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

export const addNewDiscount = createAsyncThunk(
  "discounts/addDiscount",
  async (discontObj, { rejectWithValue }) => {
    try {
      const { status, data } = await api.putDidcount(discontObj);
      if (status === 200) {
        toast.success("تخفیف با موفقیت ثبت شد", {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data.newDiscount;
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

export const getProductsWithoutDiscount = createAsyncThunk(
  "discounts/getProductsWithoutDiscount",
  async () => {
    try {
      const { data, status } = await api.getProductsWithoutDiscount();
      if (status === 200) {
        return data.products;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const expireDiscount = createAsyncThunk(
  "discounts/expireDiscount",
  async (id) => {
    try {
      const { status, data } = await api.expireDiscount(id);
      if (status === 200) {
        toast.success("تخفیف با موفقیت منقضی شد", {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data.discount;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const removeProduct = createAsyncThunk(
  "discounts/removeProduct",
  async ({ discountId, product }) => {
    try {
      const { status, data } = await api.removeProduct(discountId, product);
      if (status === 200) {
        toast.success("محصول با موفقیت از لیست تخفیف حذف شد", {
          position: "bottom-center",
          closeOnClick: true,
        });
        return data.product;
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
  name: "discounts",
  initialState: {
    status: "idle",
    entity: [],
    productsWithoutDiscount: [],
    discount: {},
  },
  reducers: {},
  extraReducers: {
    [getDiscounts.fulfilled]: (state, action) => {
      state.entity = action.payload.discounts;
      state.status = "idle";
    },
    [getDiscounts.pending]: (state) => {
      state.status = "loading";
    },
    [getDiscount.fulfilled]: (state, action) => {
      state.discount = action.payload.discount;
      state.status = "idle";
    },
    [getDiscount.pending]: (state) => {
      state.status = "loading";
    },
    [removeProduct.fulfilled]: (state, action) => {
      state.discount.includes = state?.discount?.includes?.filter(
        (p) => p?._id !== action.payload?._id
      );
      state.status = "idle";
    },
    [removeProduct.pending]: (state) => {
      state.status = "removing";
    },
    [addNewDiscount.fulfilled]: (state, action) => {
      state.entity.unshift(action.payload);
      state.status = "idle";
    },
    [addNewDiscount.pending]: (state) => {
      state.status = "creating";
    },
    [addNewDiscount.rejected]: (state, action) => {
      state.status = "idle";
    },
    [getProductsWithoutDiscount.fulfilled]: (state, action) => {
      state.productsWithoutDiscount = action.payload;
      state.status = "idle";
    },
    [getProductsWithoutDiscount.pending]: (state) => {
      state.status = "fetching";
    },
    [expireDiscount.fulfilled]: (state, action) => {
      let discountIndex = state?.entity?.findIndex(
        (d) => d?._id === action.payload?._id
      );
      state.entity[discountIndex] = action.payload;
      state.status = "idle";
    },
    [expireDiscount.pending]: (state) => {
      state.status = "expiring";
    },
  },
});
export default slice.reducer;
